import { PAGE_30_HTML } from "./page-30.js";

// Table de redirection : modifie la valeur pour changer la destination.
const REDIRECTS = {};

// Pages HTML servies directement (pas de redirection).
const PAGES = {
  "/30": PAGE_30_HTML,
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Normalise le slash final (/30/ -> /30) pour matcher les tables ci-dessus.
    const path = url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname;

    const page = PAGES[path];
    if (page) {
      return new Response(page, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    const destination = REDIRECTS[path];
    if (destination) {
      return Response.redirect(destination, 302);
    }

    return new Response("Not found", { status: 404 });
  },
};
