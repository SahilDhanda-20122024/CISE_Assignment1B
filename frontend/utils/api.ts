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

export async function updateOption(
  type: "sePractice" | "claim",
  oldValue: string,
  newValue: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/options/${type}/${encodeURIComponent(oldValue)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newValue }),
  });

  if (!res.ok) {
    throw new Error("Failed to update options");
  }

  return await res.json();
}


export async function addOption(type: 'sePractice' | 'claim', value: string) {
  const res = await fetch(`${BACKEND_URL}/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, value }),
  });
  if (!res.ok) throw new Error(`Failed to add ${type}`);
  return res.json();
}

export async function deleteOption(type: 'sePractice' | 'claim', value: string) {
  const res = await fetch(`${BACKEND_URL}/options/${type}/${encodeURIComponent(value)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete ${type}`);
  return res.json();
}