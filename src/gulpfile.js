const path = require("path");
const { URL } = require("url");
const { watch, series } = require("gulp");
const browserSync = require("browser-sync").create();

const root = path.join(__dirname, "..");

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
    open: "/submit-your-artwork/",
    notify: false,
    port: 3000,
  });
  watch(
    [path.join(root, "**/*.html"), path.join(root, "**/*.css")],
    { ignoreInitial: true },
    (done) => {
      browserSync.reload();
      done();
    }
  );
}

exports.serve = series(serve);
exports.default = series(serve);
