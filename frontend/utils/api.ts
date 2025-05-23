const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  const data = await res.json();

  // Inspect the structure
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.articles)) return data.articles;
  return []; // fallback
}


export async function submitArticle(article: any) {
  const res = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  return await res.json();
}
