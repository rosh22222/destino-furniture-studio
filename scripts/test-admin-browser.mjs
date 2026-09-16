import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createCmsTestServer } from "./cms-test-server.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = process.cwd();
const sandbox = await mkdtemp(path.join(tmpdir(), "destino-cms-browser-"));
const mock = await createCmsTestServer();
const screenshots = path.join(root, ".next", "cms-test-screenshots");
await mkdir(screenshots, { recursive: true });
let browser;
let child;
let log = "";

try {
  for (const dir of ["app", "components", "lib"]) await cp(path.join(root, dir), path.join(sandbox, dir), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "postcss.config.mjs", "next-env.d.ts"]) await cp(path.join(root, file), path.join(sandbox, file));
  for (const dir of ["node_modules", "public"]) await symlink(path.join(root, dir), path.join(sandbox, dir), "junction");
  const config = await readFile(path.join(root, "next.config.ts"), "utf8");
  await writeFile(path.join(sandbox, "next.config.ts"), config.replace('protocol: "https"', 'protocol: "http"').replace('formats: [', 'dangerouslyAllowLocalIP: true, formats: ['));
  // The storage fixture uses a local HTTP server; uploaded URLs are still validated in production.
  const mediaPath = path.join(sandbox, "lib", "admin-media.ts");
  await writeFile(mediaPath, (await readFile(mediaPath, "utf8")).replace('new URL(value).protocol === "https:"', '["http:", "https:"].includes(new URL(value).protocol)'));
  child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "dev", "--webpack", "--port", "0"], {
    cwd: sandbox, windowsHide: true,
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: mock.url, NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const append = (chunk) => { log += chunk.toString(); };
  child.stdout.on("data", append);
  child.stderr.on("data", append);
  const deadline = Date.now() + 120000;
  let base;
  while (Date.now() < deadline) {
    base = log.match(/http:\/\/localhost:(\d+)/)?.[0];
    if (base && log.includes("Ready")) break;
    if (child.exitCode !== null) throw new Error(log);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  assert.ok(base, log);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(45000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/admin/login`, { timeout: 120000 });
  await page.getByLabel("Email", { exact: true }).fill(mock.user.email);
  await page.getByLabel("Password", { exact: true }).fill("fixture-only-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(`${base}/admin`, { timeout: 120000 });
  await page.goto(`${base}/admin/products`, { timeout: 120000 });
  await page.getByRole("searchbox", { name: "Search products" }).fill("Workstation Table 7");
  const article = page.locator("article").filter({ hasText: "Workstation Table 7" }).first();
  await article.locator('button[aria-expanded]').click();
  await page.getByRole("searchbox", { name: "Search products" }).fill("");
  let editor = article.locator("form").first();
  await editor.getByLabel(/^Product name/).fill("Browser-tested workstation");
  assert.equal(await editor.getByLabel("Page slug", { exact: true }).inputValue(), "browser-tested-workstation");
  await editor.getByLabel("Description", { exact: true }).fill("***Comfort and quality***\n\nUpdated product details.");
  const sourceImage = await readFile(path.join(root, "public/images/products/tables/workstation/work1.png"));
  const largeImage = sourceImage.length > 1200000 ? sourceImage : Buffer.concat([sourceImage, Buffer.alloc(1200000 - sourceImage.length)]);
  assert.ok(largeImage.length < 5 * 1024 * 1024);
  await editor.locator('input[name="image"]').setInputFiles({ name: "updated-workstation.png", mimeType: "image/png", buffer: largeImage });
  await editor.getByLabel("Gallery media URLs").fill("/images/products/tables/workstation/work2.png\n/images/products/tables/workstation/work3.png");
  await editor.getByRole("button", { name: "Save Record" }).click();
  await page.getByRole("status").filter({ hasText: "Record saved." }).waitFor();
  const product = mock.tables.get("products").find((row) => row.slug === "browser-tested-workstation");
  assert.equal(product.title, "Browser-tested workstation");
  assert.ok(product.image_url.includes("/storage/"));
  const savedProductArticle = page.locator("article").filter({ hasText: "Browser-tested workstation" }).first();
  editor = savedProductArticle.locator("form").first();
  assert.equal(await editor.getByLabel(/^Product name/).inputValue(), product.title);
  assert.equal(await editor.locator('img[alt="Admin image preview"]').getAttribute("src"), product.image_url);
  await editor.getByLabel("Description", { exact: true }).fill("A second saved description.");
  await editor.getByRole("button", { name: "Save Record" }).click();
  await page.waitForFunction(() => document.querySelector('button[type="submit"]') !== null);
  await page.waitForTimeout(1500);
  assert.equal(product.content.fullDescription, "A second saved description.");

  mock.state.failWrite = true;
  await editor.getByLabel("Description", { exact: true }).fill("Keep this text after a failed save.");
  await editor.getByRole("button", { name: "Save Record" }).click();
  await editor.getByRole("status").filter({ hasText: "could not be saved" }).waitFor();
  assert.equal(await editor.getByLabel("Description", { exact: true }).inputValue(), "Keep this text after a failed save.");
  mock.state.failWrite = false;
  await editor.getByRole("button", { name: "Save Record" }).click();
  await editor.getByRole("status").filter({ hasText: "Record saved." }).waitFor();
  assert.equal(product.content.fullDescription, "Keep this text after a failed save.");
  await editor.getByLabel(/^Product name/).scrollIntoViewIfNeeded();
  await savedProductArticle.locator('button[aria-expanded] img').evaluate((img) => img.decode());
  await page.screenshot({ path: path.join(screenshots, "products-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await editor.getByLabel(/^Product name/).scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(screenshots, "products-mobile.png") });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log("PASS browser: product image >1 MB, repeat save, failed-save recovery, desktop and mobile");

  const publicPage = await browser.newPage();
  await publicPage.goto(`${base}/product/${product.slug}`, { timeout: 120000 });
  await publicPage.getByRole("heading", { name: "Browser-tested workstation", exact: true }).waitFor();
  await publicPage.getByText("Keep this text after a failed save.", { exact: true }).first().waitFor();
  await publicPage.close();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/admin/projects`, { timeout: 120000 });
  await page.getByRole("searchbox", { name: "Search projects" }).fill("collector");
  const projectArticle = page.locator("article").filter({ hasText: "Collector Camp Office" }).first();
  await projectArticle.locator('button[aria-expanded]').click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("");
  let projectForm = projectArticle.locator("form").first();
  await projectForm.getByLabel(/^Project title/).fill("Browser-tested project");
  assert.equal(await projectForm.getByLabel("Page slug", { exact: true }).inputValue(), "browser-tested-project");
  await projectForm.getByLabel("Location", { exact: true }).fill("Visakhapatnam");
  await projectForm.getByLabel("Client name", { exact: true }).fill("CMS Test Client");
  await projectForm.getByLabel("Project description", { exact: true }).fill("**Updated work**\n\nProject details confirmed.");
  await projectForm.getByRole("button", { name: "Save Record" }).click();
  await page.getByRole("status").filter({ hasText: "Record saved." }).waitFor();
  const project = mock.tables.get("projects").find((row) => row.title === "Browser-tested project");
  assert.equal(project.content.location, "Visakhapatnam");
  const savedProjectArticle = page.locator("article").filter({ hasText: "Browser-tested project" }).first();
  projectForm = savedProjectArticle.locator("form").first();
  await projectForm.getByLabel(/^Project title/).scrollIntoViewIfNeeded();
  await savedProjectArticle.locator('button[aria-expanded] img').evaluate((img) => img.decode());
  await page.screenshot({ path: path.join(screenshots, "projects-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(screenshots, "projects-mobile.png") });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.reload();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Browser-tested project");
  await page.locator("article").first().locator('button[aria-expanded]').click();
  assert.equal(await page.locator("article").first().getByLabel("Client name", { exact: true }).inputValue(), "CMS Test Client");
  await page.goto(`${base}/projects/${project.slug}`, { timeout: 120000 });
  await page.getByRole("heading", { name: "Browser-tested project", exact: true }).waitFor();
  await page.getByText("CMS Test Client", { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS browser: project edits persist after reload and appear on the public detail page");
  console.log(`Screenshots: ${screenshots}`);
} catch (error) {
  if (browser) {
    const failedPage = browser.contexts()[0]?.pages()[0];
    if (failedPage) {
      await failedPage.screenshot({ path: path.join(screenshots, "failure.png") }).catch(() => {});
      await writeFile(path.join(screenshots, "failure.html"), await failedPage.content()).catch(() => {});
    }
  }
  console.error(log.slice(-12000));
  throw error;
} finally {
  await browser?.close();
  if (child && child.exitCode === null) {
    if (process.platform === "win32") {
      await new Promise((resolve) => spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" }).on("exit", resolve));
    } else child.kill("SIGTERM");
  }
  await mock.close();
}
