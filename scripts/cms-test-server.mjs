import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

// An isolated Supabase-compatible fixture. No requests or writes reach the live database.
export async function createCmsTestServer() {
  const tables = new Map([["profiles", [{ id: "11111111-1111-4111-8111-111111111111", role: "admin" }]]]);
  const files = new Map();
  const user = { id: "11111111-1111-4111-8111-111111111111", aud: "authenticated", role: "authenticated", email: "cms-test@example.com", app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
  const jwt = [ { alg: "HS256", typ: "JWT" }, { sub: user.id, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 } ]
    .map((part) => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".") + ".test-signature";
  let clock = Date.now();
  const state = { tables, files, user, jwt, failWrite: false, failUploadAt: 0, uploadCount: 0, authenticated: true };
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const respond = (data, status = 200) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
    };
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    if (url.pathname === "/auth/v1/token") return respond({ access_token: jwt, refresh_token: "test-refresh-token", token_type: "bearer", expires_in: 3600, user });
    if (url.pathname === "/auth/v1/user") return respond(user);
    if (url.pathname.startsWith("/storage/v1/object/public/website-media/")) {
      const file = files.get(decodeURIComponent(url.pathname.split("/website-media/")[1]));
      res.writeHead(file ? 200 : 404, { "content-type": "image/png" });
      return res.end(file);
    }
    if (url.pathname.startsWith("/storage/v1/object/website-media")) {
      if (req.method === "DELETE") {
        for (const path of JSON.parse(body).prefixes) files.delete(path);
        return respond([]);
      }
      state.uploadCount++;
      if (state.failUploadAt === state.uploadCount) return respond({ message: "Test upload failed" }, 500);
      const path = decodeURIComponent(url.pathname.split("/website-media/")[1]);
      let bytes = body;
      if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
        const form = await new Request("http://localhost", { method: "POST", headers: { "content-type": req.headers["content-type"] }, body }).formData();
        const file = [...form.values()].find((value) => typeof value !== "string");
        if (file) bytes = Buffer.from(await file.arrayBuffer());
      }
      files.set(path, bytes);
      return respond({ Key: `website-media/${path}` });
    }
    if (url.pathname === "/rest/v1/rpc/catalogue_overrides") {
      const resource = JSON.parse(body).resource;
      return respond((tables.get(resource) || []).map((row) => ({ slug: row.content?._seedSlug || row.slug })));
    }
    if (!url.pathname.startsWith("/rest/v1/")) return respond({ message: "Not found" }, 404);
    const table = url.pathname.split("/").at(-1);
    if (!tables.has(table)) tables.set(table, []);
    const rows = tables.get(table);
    let selected = rows.filter((row) => [...url.searchParams].every(([key, value]) => {
      if (!value.startsWith("eq.")) return true;
      const actual = key.startsWith("content->>") ? row.content?.[key.slice(10)] : row[key];
      return String(actual) === value.slice(3);
    }));
    if (req.method === "GET") {
      const order = url.searchParams.get("order")?.split(",") || [];
      selected.sort((a, b) => {
        for (const entry of order) {
          const [key, direction] = entry.split(".");
          if (a[key] !== b[key]) return (a[key] > b[key] ? 1 : -1) * (direction === "desc" ? -1 : 1);
        }
        return 0;
      });
      const offset = Number(url.searchParams.get("offset") || 0);
      selected = selected.slice(offset, offset + Number(url.searchParams.get("limit") || selected.length));
    } else {
      if (state.failWrite) return respond({ code: "TEST_FAILURE", message: "Test save failure" }, 500);
      const payload = body.length ? JSON.parse(body) : {};
      if (req.method === "POST") {
        if (rows.some((row) => row.slug === payload.slug || (payload.content?._seedSlug && row.content?._seedSlug === payload.content._seedSlug))) {
          return respond({ code: "23505", message: "Duplicate" }, 409);
        }
        const row = { id: randomUUID(), created_at: new Date(++clock).toISOString(), updated_at: new Date(++clock).toISOString(), ...payload };
        rows.push(row);
        selected = [row];
      } else if (req.method === "PATCH") {
        selected.forEach((row) => Object.assign(row, payload, { updated_at: new Date(++clock).toISOString() }));
      } else if (req.method === "DELETE") {
        tables.set(table, rows.filter((row) => !selected.includes(row)));
      }
    }
    if (req.headers.accept?.includes("application/vnd.pgrst.object+json")) {
      if (selected.length !== 1) return respond({ code: "PGRST116", details: "The result contains 0 rows", message: "No row" }, 406);
      return respond(selected[0]);
    }
    respond(selected);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { ...state, state, url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }) };
}
