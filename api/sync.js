const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019e6dd5-ac3f-7aad-be8f-dd8e17ed9793';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  
  if (req.method === 'GET') {
    const resp = await fetch(BLOB_URL);
    const data = await resp.text();
    return res.status(resp.status).send(data);
  }
  
  if (req.method === 'PUT' || req.method === 'POST') {
    const resp = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await resp.text();
    return res.status(resp.status).send(data);
  }
  
  return res.status(405).send('Method Not Allowed');
}
