const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchArticles() {
  const res = await fetch(`${BACKEND_URL}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function createArticle(article: any) {
  const res = await fetch(`${BACKEND_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function updateArticleStatus(id: string, status: string) {
  const res = await fetch(`${BACKEND_URL}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update article status');
  return res.json();
}

export async function updateArticle(id: string, updatedData: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error('Failed to update article');
  }
  return await res.json();
}



export async function fetchOptions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/options`);
  if (!res.ok) throw new Error('Failed to fetch options');
  return res.json();
}

export async function updateOptions(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/options`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update options');
  return res.json();
}