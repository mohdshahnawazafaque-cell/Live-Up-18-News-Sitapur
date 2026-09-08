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
      
      // Use AbortController to ensure we don't hold up the response too long for picky scrapers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout
      
      const dbRes = await fetch(firestoreUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
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
        
        // Remove existing OG tags to avoid duplicates
        html = html.replace(/<meta property="og:title".*?>/g, '');
        html = html.replace(/<meta property="og:description".*?>/g, '');
        html = html.replace(/<meta property="og:image".*?>/g, '');
        html = html.replace(/<meta property="og:type".*?>/g, '');
        html = html.replace(/<meta name="twitter:.*?>/g, '');

        // Inject new comprehensive tags right before </head>
        const metaTags = `
    <title>${safeHeadline}</title>
    <meta property="og:title" content="${safeHeadline}" />
    <meta property="og:description" content="${safeContent}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="450" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${request.url}" />
    <meta property="og:site_name" content="LIVE UP 18 NEWS" />
    <meta itemprop="name" content="${safeHeadline}" />
    <meta itemprop="description" content="${safeContent}" />
    <meta itemprop="image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeHeadline}" />
    <meta name="twitter:description" content="${safeContent}" />
    <meta name="twitter:image" content="${image}" />
</head>`;
        
        html = html.replace(/<title>.*?<\/title>/, ''); // remove old title
        html = html.replace('</head>', metaTags);

        return new Response(html, {
          headers: response.headers
        });
      }
    } catch (e) {
      console.error("Error in Edge Function fetching article data:", e);
      // Fallback to original html on error/timeout
    }
  }

  return response;
};
