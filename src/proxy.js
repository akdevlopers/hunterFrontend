import { NextResponse } from "next/server";

/**
 * Legacy URL handling.
 *
 * Before this Next.js app, hunterclothing.in ran on the store platform, whose
 * URLs looked like /hunter-mens-wear/product/<slug> and whose images were
 * served from /uploads/6/<file>. Facebook's crawler and old shared links still
 * request those paths tens of thousands of times a day. Without this file each
 * hit server-renders the full 404 page with `Cache-Control: no-store`, so the
 * CDN forwards every one of them to the origin.
 *
 * Here we answer them before any rendering happens, with tiny responses that
 * CloudFront is allowed to cache.
 */

// `config.matcher` below must be a literal, so the slug is hardcoded here too.
const LEGACY_STORE_PREFIX = "/hunter-mens-wear";

// Where the old /uploads/<store id>/... files live now. This is the host the
// API's `image_url` fields point at (`image_path` is the matching /uploads path).
const LEGACY_ASSET_HOST = "https://d198l0yp2i7sp9.cloudfront.net";

// Browsers keep the answer for a day, the CDN for a year. These URLs never come back.
const CACHE_CONTROL = "public, max-age=86400, s-maxage=31536000";

// What a real product slug from the API looks like, e.g. "red-spider-limited-edition-crocs".
const PRODUCT_SLUG = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i;

function movedPermanently(url) {
  return NextResponse.redirect(url, {
    status: 301,
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

function gone() {
  return new NextResponse(null, {
    status: 410,
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  // Old image paths: send them to the asset CDN instead of rendering a 404.
  if (pathname.startsWith("/uploads/")) {
    return movedPermanently(new URL(pathname + search, LEGACY_ASSET_HOST));
  }

  // Old storefront paths.
  const rest = pathname.slice(LEGACY_STORE_PREFIX.length).replace(/\/+$/, "");

  if (rest === "") {
    return movedPermanently(new URL("/", request.url));
  }

  const product = rest.match(/^\/product\/([^/]+)$/);
  if (product) {
    let slug = product[1];
    try {
      slug = decodeURIComponent(slug);
    } catch {
      // Malformed escape sequence: keep the raw value, it fails the slug check below.
    }
    if (PRODUCT_SLUG.test(slug)) {
      return movedPermanently(new URL(`/products/${slug.toLowerCase()}`, request.url));
    }
    // e.g. /product/Ecommerce%2520Pro: not a product slug and never was one.
    return gone();
  }

  if (/^\/collections(\/|$)/.test(rest)) {
    return movedPermanently(new URL("/products", request.url));
  }

  return gone();
}

export const config = {
  matcher: ["/uploads/:path*", "/hunter-mens-wear/:path*"],
};
