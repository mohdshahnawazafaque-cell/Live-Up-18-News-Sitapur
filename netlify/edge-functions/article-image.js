export default async (request, context) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const articleId = pathParts[pathParts.length - 1];

  if (!articleId) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0319583234/databases/ai-studio-liveup18news-6a9c02cc-41a6-4f64-ab51-964a11eec3b9/documents/news/${articleId}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const dbRes = await fetch(firestoreUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!dbRes.ok) {
      // Fallback redirect to default logo
      return Response.redirect(`${url.origin}/logo.png`, 302);
    }

    const data = await dbRes.json();
    const rawImage = data.fields?.featuredImage?.stringValue;

    if (!rawImage) {
      return Response.redirect(`${url.origin}/logo.png`, 302);
    }

    // If it's a data URI (base64 image)
    const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1] || 'image/jpeg';
      const base64Data = match[2];
      
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Response(bytes, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": bytes.length.toString(),
          "Cache-Control": "public, max-age=86400, s-maxage=604800",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // If it's an external HTTP/HTTPS URL, redirect directly to it
    if (rawImage.startsWith('http')) {
      return Response.redirect(rawImage, 302);
    }

    return Response.redirect(`${url.origin}/logo.png`, 302);
  } catch (e) {
    console.error("Error serving article image:", e);
    return Response.redirect(`${url.origin}/logo.png`, 302);
  }
};
