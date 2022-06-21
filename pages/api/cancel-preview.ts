export default async function cancelPreview(req, res) {
  const { slug } = req.query;

  res.clearPreviewData();
  res.writeHead(307, { Location: slug });
  res.end();
}
