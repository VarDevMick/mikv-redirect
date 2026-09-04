// Table de redirection : modifie la valeur pour changer la destination.
const REDIRECTS = {
  "/30": "https://google.com",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Normalise le slash final (/30/ -> /30) pour matcher REDIRECTS.
    const path = url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname;

    const destination = REDIRECTS[path];
    if (destination) {
      return Response.redirect(destination, 302);
    }

    return new Response("Not found", { status: 404 });
  },
};
