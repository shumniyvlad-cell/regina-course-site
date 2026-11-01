import type { APIRoute } from 'astro';

// Для project page (github.io/<repo>/) поисковики читают robots.txt только с корня домена,
// поэтому главная защита раздела — noindex на страницах и шифрование. Со своим доменом файл заработает.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const sitemap = new URL(`${base}sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nDisallow: ${base}learn/\nDisallow: ${base}m/\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
