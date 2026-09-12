export default async (request, context) => {
  const url = new URL(request.url);
  const origin = url.origin; // e.g. https://liveup18news.netlify.app or https://liveup18news.com

  // Fetch the static sitemap.xml
  const response = await context.next();
  
  try {
    let xml = await response.text();

    // If served from a custom domain (e.g. liveup18news.com), adapt the URLs in sitemap
    if (!origin.includes('liveup18news.netlify.app') && origin.startsWith('http')) {
      xml = xml.replace(/https:\/\/liveup18news\.netlify\.app/g, origin);
    }

    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600, s-maxage=86400"
      }
    });
  } catch (e) {
    return response;
  }
};
