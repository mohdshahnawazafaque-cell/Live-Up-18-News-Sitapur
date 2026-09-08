export default async (request, context) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const articleId = pathParts[pathParts.length - 1];

  // Fetch the actual index.html first
  const response = await context.next();
  
  if (response.headers.get("content-type")?.includes("text/html")) {
    try {
      // Fetch article data from Firestore REST API
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0319583234/databases/ai-studio-liveup18news-6a9c02cc-41a6-4f64-ab51-964a11eec3b9/documents/news/${articleId}`;
      const dbRes = await fetch(firestoreUrl);
      
      if (dbRes.ok) {
        const data = await dbRes.json();
        
        const headline = data.fields?.headline?.stringValue || 'LIVE UP 18 NEWS';
        let content = data.fields?.content?.stringValue || 'A modern, professional, responsive Indian digital news portal.';
        const image = data.fields?.featuredImage?.stringValue || 'https://liveup18news.netlify.app/logo.png';

        // Truncate content for description
        if (content.length > 150) content = content.substring(0, 150) + '...';

        // Escape quotes to prevent breaking HTML attributes
        const safeHeadline = headline.replace(/"/g, '&quot;');
        const safeContent = content.replace(/"/g, '&quot;');

        let html = await response.text();
        html = html.replace(/<title>.*?<\/title>/, `<title>${safeHeadline}</title>`);
        html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${safeHeadline}" />`);
        html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${safeContent}" />`);
        html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${image}" />`);
        html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${safeContent}" />`);
        
        // Twitter cards
        html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${safeHeadline}" />`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${safeContent}" />`);
        html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${image}" />`);

        return new Response(html, {
          headers: response.headers
        });
      }
    } catch (e) {
      console.error("Error in Edge Function fetching article data:", e);
    }
  }

  return response;
};
