export default async function handler(req, res) {
  try {
    await res.revalidate('/articles');
    await res.revalidate('/');
    
    const postSlug = req.body.query.slug['en-US'];
    if (!postSlug) await res.validate(`/articles/${postSlug}`);
  
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}