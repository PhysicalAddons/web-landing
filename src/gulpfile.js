const path = require("path");
const fs = require("fs/promises");
const { URL } = require("url");
const { watch, series, parallel, src, dest } = require("gulp");
const browserSync = require("browser-sync").create();
const twig = require("gulp-twig");
const sass = require("gulp-sass")(require("sass"));
const sharp = require("sharp");

const root = path.join(__dirname, "..");

// Same widths as the PSA landing srcset — keeps bandwidth low on every screen.
const IMAGE_WIDTHS = [1220, 1300, 1500, 1700, 2050, 2560];

function css() {
  return src("./home.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest(path.join(root, "assets/css")))
    .pipe(browserSync.stream());
}

function html() {
  return src("./index.twig")
    .pipe(twig({ data: {} }))
    .pipe(dest(root));
}

function scripts() {
  return src("./javascript/*.js").pipe(dest(path.join(root, "assets/javascript")));
}

/**
 * Generate responsive JPEG variants for product hero images.
 * Drop one high-quality JPEG per product into src/images/products/
 * (atmosphere.jpg, oceans.jpg, planets.jpg). Existing variants are skipped;
 * delete /assets/images/products/ to force a full regeneration.
 */
async function images() {
  const srcDir = path.join(__dirname, "images/products");
  const outDir = path.join(root, "assets/images/products");
  await fs.mkdir(outDir, { recursive: true });
  const files = (await fs.readdir(srcDir)).filter((f) => /\.jpe?g$/i.test(f));
  for (const file of files) {
    const name = file.replace(/\.jpe?g$/i, "");
    for (const width of IMAGE_WIDTHS) {
      const out = path.join(outDir, `${name}-${width}.jpeg`);
      try {
        await fs.access(out);
        continue; // already generated
      } catch {}
      await sharp(path.join(srcDir, file))
        .resize({ width })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(out);
    }
  }
}

/**
 * Netlify handles form POSTs in production. BrowserSync only serves static files, so a POST to
 * /submit-your-artwork/success/ would error locally. Redirect POST → GET so the thank-you page loads in dev.
 */
function devFormSuccessRedirect(req, res, next) {
  if (req.method !== "POST") {
    return next();
  }
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (
    pathname === "/submit-your-artwork/success" ||
    pathname === "/submit-your-artwork/success/"
  ) {
    res.writeHead(302, { Location: "/submit-your-artwork/success/" });
    res.end();
    return;
  }
  next();
}

function serve() {
  browserSync.init({
    server: {
      baseDir: root,
      index: "index.html",
      directory: false,
      middleware: [devFormSuccessRedirect],
    },
    open: "/",
    notify: false,
    port: 3000,
  });
  watch(["*.scss", "partials/**/*.scss"], { ignoreInitial: true }, css);
  watch(["*.twig", "partials/**/*.twig"], { ignoreInitial: true }, html);
  watch(["javascript/*.js"], { ignoreInitial: true }, scripts);
  watch(
    [path.join(root, "**/*.html"), path.join(root, "**/*.css"), path.join(root, "assets/javascript/*.js")],
    { ignoreInitial: true, ignored: ["**/node_modules/**"] },
    (done) => {
      browserSync.reload();
      done();
    }
  );
}

const build = series(parallel(css, html, scripts), images);

exports.css = css;
exports.html = html;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.serve = series(build, serve);
exports.default = series(build, serve);
