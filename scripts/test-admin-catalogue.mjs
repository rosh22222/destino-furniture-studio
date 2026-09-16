import assert from "node:assert/strict";
import { build } from "esbuild";
import { createClient } from "@supabase/supabase-js";
import { createCmsTestServer } from "./cms-test-server.mjs";

const mock = await createCmsTestServer();
const client = createClient(mock.url, "test-anon-key", { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = client.storage.from.bind(client.storage);
client.storage.from = (name) => {
  const storage = bucket(name);
  const publicUrl = storage.getPublicUrl.bind(storage);
  storage.getPublicUrl = (...args) => {
    const result = publicUrl(...args);
    result.data.publicUrl = result.data.publicUrl.replace(mock.url, "https://cms-fixture.example");
    return result;
  };
  return storage;
};
client.auth.getUser = async () => ({ data: { user: mock.state.authenticated ? mock.user : null }, error: null });
globalThis.__cmsTestClient = client;
globalThis.__cmsRevalidated = [];
let checks = 0;
function pass(name) { checks++; console.log(`PASS ${name}`); }

try {
  const result = await build({
    stdin: { contents: 'export * from "./app/admin/actions"; export * from "./lib/admin"; export * from "./lib/content";', resolveDir: process.cwd() },
    bundle: true, write: false, format: "esm", platform: "node", target: "node24",
    plugins: [{ name: "isolated-cms", setup(builder) {
      builder.onResolve({ filter: /^(server-only|next\/cache|next\/navigation|@\/lib\/supabase)$/ }, (args) => ({ path: args.path, namespace: "fixture" }));
      builder.onLoad({ filter: /.*/, namespace: "fixture" }, ({ path }) => ({ contents:
        path === "server-only" ? "export {};" : path === "next/cache" ? 'export function revalidatePath(...args) { globalThis.__cmsRevalidated.push(args); }' :
        path === "next/navigation" ? 'export function redirect(path) { throw new Error("Redirect: " + path); }' :
        'export function isSupabaseConfigured() { return true; } export function createPublicSupabaseClient() { return globalThis.__cmsTestClient; } export async function createCookieSupabaseClient() { return globalThis.__cmsTestClient; }',
      }));
    } }],
  });
  const cms = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
  const resource = (name) => cms.getAdminResource(name);
  const form = (name, record, changes = {}) => {
    const data = new FormData();
    data.set("resource", name);
    if (record) {
      if (record.isSeed) data.set("seedSlug", record.slug);
      else { data.set("id", record.id); data.set("expectedUpdatedAt", record.updatedAt); }
      data.set("title", record.title);
      data.set("slug", record.slug);
      data.set("status", record.status);
      data.set("imageAlt", record.imageAlt || "");
      for (const key of ["categorySlug", "furnitureType", "sku", "clientName", "location", "sector", "coverVideo"]) data.set(key, record.content?.[key] ?? "");
      for (const key of ["features", "scope", "categories"]) data.set(key, (record.content?.[key] || []).join("\n"));
      data.set("galleryUrls", (record.content?.gallery || []).filter((url) => url !== record.imageUrl).join("\n"));
      data.set("fullDescription", record.content?.fullDescription ?? record.content?.shortDescription ?? "");
      data.set("description", record.content?.description ?? "");
    }
    for (const [key, value] of Object.entries(changes)) data.set(key, value);
    return data;
  };
  const save = async (data) => {
    const result = await cms.saveAdminRecord({ ok: false, message: "" }, data);
    assert.equal(result.ok, true, result.message);
    return result.record;
  };
  const image = new File([new Uint8Array(1024)], "chair.png", { type: "image/png" });
  const originals = await cms.getAdminRows(resource("products"));
  assert.equal(originals.length, cms.getSeedRows("products").length);
  pass("all original catalogue entries are editable");
  const original = originals.find((row) => row.content?.brandSlug) || originals[0];
  let saved = await save(form("products", original, { title: "Edited chair", fullDescription: "***Premium comfort***\n\nSecond paragraph.", image, galleryImages: image }));
  assert.equal(saved.content.brandSlug, original.content.brandSlug);
  assert.deepEqual(saved.content.materials, original.content.materials);
  assert.equal(saved.content.shortDescription, saved.content.fullDescription);
  assert.ok(saved.imageUrl.includes("/storage/"));
  const savedCover = saved.imageUrl;
  const savedGallery = saved.content.gallery;
  saved = await save(form("products", saved, { title: "Edited twice" }));
  assert.equal(saved.imageUrl, savedCover);
  assert.deepEqual(saved.content.gallery, savedGallery);
  pass("repeat saves preserve uploaded images, rich description and hidden product details");

  const stale = saved;
  saved = await save(form("products", saved, { fullDescription: "", galleryUrls: "", deleteImage: "on" }));
  const publicProduct = (await cms.getProducts()).find((row) => row.slug === saved.slug);
  assert.equal(publicProduct.image, "");
  assert.equal(publicProduct.shortDescription, "");
  assert.deepEqual(publicProduct.gallery, []);
  assert.equal((await cms.saveAdminRecord({}, form("products", stale, { title: "Stale change" }))).ok, false);
  pass("cleared fields stay empty and stale tabs cannot overwrite newer edits");

  saved = await save(form("products", saved, { slug: "renamed-chair" }));
  assert.equal((await cms.getProducts()).filter((row) => row.slug === original.slug).length, 0);
  assert.equal((await cms.getAdminRows(resource("products"))).filter((row) => row.slug === original.slug).length, 0);
  saved = await save(form("products", saved, { status: "draft" }));
  assert.ok(!(await cms.getProducts()).some((row) => [original.slug, saved.slug].includes(row.slug)));
  saved = await save(form("products", saved, { status: "published" }));
  assert.ok((await cms.getProducts()).some((row) => row.slug === saved.slug));
  const deleteForm = form("products", saved);
  assert.equal((await cms.deleteAdminRecord({}, deleteForm)).ok, true);
  assert.ok(!(await cms.getProducts()).some((row) => [original.slug, saved.slug].includes(row.slug)));
  assert.ok(!(await cms.getAdminRows(resource("products"))).some((row) => [original.slug, saved.slug].includes(row.slug)));
  pass("renaming, drafting, republishing and deleting never resurrect original products");

  const next = originals.find((row) => row.slug !== original.slug);
  const failedFilesBefore = mock.files.size;
  mock.state.failWrite = true;
  assert.equal((await cms.saveAdminRecord({}, form("products", next, { image }))).ok, false);
  assert.equal(mock.files.size, failedFilesBefore);
  mock.state.failWrite = false;
  const invalid = form("products", next, { image, galleryImages: new File(["bad"], "bad.svg", { type: "image/svg+xml" }) });
  const uploadsBefore = mock.state.uploadCount;
  assert.equal((await cms.saveAdminRecord({}, invalid)).ok, false);
  assert.equal(mock.state.uploadCount, uploadsBefore);
  mock.state.failUploadAt = uploadsBefore + 2;
  assert.equal((await cms.saveAdminRecord({}, form("products", next, { image, galleryImages: image }))).ok, false);
  assert.equal(mock.files.size, failedFilesBefore);
  mock.state.failUploadAt = 0;
  pass("invalid files are rejected before upload and failed saves clean up new files");

  const maxOrder = Math.max(...originals.filter((row) => row.content.categorySlug === next.content.categorySlug).map((row) => row.displayOrder));
  const added = await save(form("products", null, { title: "New chair", slug: "new-chair", status: "published", furnitureType: next.content.furnitureType, categorySlug: next.content.categorySlug, image }));
  assert.ok(added.displayOrder > maxOrder);
  assert.equal((await cms.saveAdminRecord({}, form("products", null, { title: "Duplicate", slug: "new-chair", categorySlug: next.content.categorySlug, furnitureType: next.content.furnitureType }))).ok, false);
  assert.equal((await cms.saveAdminRecord({}, form("products", null, { title: "Collision", slug: next.slug, categorySlug: next.content.categorySlug, furnitureType: next.content.furnitureType }))).ok, false);
  assert.equal((await cms.saveAdminRecord({}, form("products", null, { title: "", slug: "", furnitureType: "Chairs", categorySlug: "office-chairs" }))).ok, false);
  pass("new products append after category originals and duplicates cannot overwrite records");

  const project = cms.getSeedRows("projects").find((row) => row.content.relatedProductSlugs.length) || cms.getSeedRows("projects")[0];
  let editedProject = await save(form("projects", project, { title: "Updated project", location: "New city", clientName: "Updated client", description: "**New work**\n\nSecond paragraph.", image }));
  assert.deepEqual(editedProject.content.relatedProductSlugs, project.content.relatedProductSlugs);
  assert.equal(editedProject.content.featured, project.content.featured);
  editedProject = await save(form("projects", editedProject, { description: "", location: "", clientName: "", scope: "", galleryUrls: "", deleteImage: "on", coverVideo: "" }));
  let publicProject = (await cms.getProjects()).find((row) => row.slug === editedProject.slug);
  for (const key of ["description", "location", "clientName", "coverImage", "coverVideo"]) assert.equal(publicProject[key], "");
  assert.deepEqual(publicProject.scope, []);
  assert.deepEqual(publicProject.gallery, []);
  editedProject = await save(form("projects", editedProject, { slug: "renamed-project", status: "draft" }));
  assert.ok(!(await cms.getProjects()).some((row) => [project.slug, editedProject.slug].includes(row.slug)));
  editedProject = await save(form("projects", editedProject, { status: "published" }));
  publicProject = (await cms.getProjects()).find((row) => row.slug === editedProject.slug);
  assert.ok(publicProject);
  assert.equal((await cms.deleteAdminRecord({}, form("projects", editedProject))).ok, true);
  assert.ok(!(await cms.getProjects()).some((row) => [project.slug, editedProject.slug].includes(row.slug)));
  pass("project edits preserve relationships, honour removals, rename, draft and delete correctly");

  for (let i = 0; i < 520; i++) mock.tables.get("products").push({
    ...mock.tables.get("products").find((row) => row.slug === "new-chair"),
    id: `large-catalogue-${i}`, slug: `large-catalogue-${i}`, content: { ...added.content },
  });
  assert.equal((await cms.getAdminRows(resource("products"))).filter((row) => row.slug.startsWith("large-catalogue-")).length, 520);
  assert.equal((await cms.getProducts()).filter((row) => row.slug.startsWith("large-catalogue-")).length, 520);
  pass("admin and website load beyond the old 100/500 record limits");

  mock.state.authenticated = false;
  assert.equal((await cms.saveAdminRecord({}, form("products", added, { title: "Unauthorized" }))).ok, false);
  assert.equal((await cms.deleteAdminRecord({}, form("products", added))).ok, false);
  assert.ok(globalThis.__cmsRevalidated.some(([path, type]) => path === "/" && type === "layout"));
  pass("unauthorized mutations are rejected and saves invalidate all affected website pages");
  console.log(`${checks} CMS regression groups passed.`);
} finally {
  await mock.close();
}
