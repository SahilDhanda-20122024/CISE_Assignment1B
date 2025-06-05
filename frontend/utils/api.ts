const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BACKEND_URL) {
  throw new Error('Environment variable NEXT_PUBLIC_API_URL is not defined');
}

// Helper to handle fetch responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Unknown API error');
  }
  return res.json();
}

// ------------------ Article API ------------------

export async function fetchArticles() {
  const res = await fetch(`${BACKEND_URL}/articles`);
  return handleResponse(res);
}

export async function createArticle(article: any) {
  const res = await fetch(`${BACKEND_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  return handleResponse(res);
}

export async function updateArticleStatus(id: string, status: string) {
  const res = await fetch(`${BACKEND_URL}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function updateArticle(id: string, updatedData: any) {
  const res = await fetch(`${BACKEND_URL}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(res);
}

// ------------------ Options API ------------------

export async function fetchOptions() {
  const res = await fetch(`${BACKEND_URL}/options`);
  return handleResponse(res);
}

export async function updateOption(
  type: 'sePractice' | 'claim',
  oldValue: string,
  newValue: string
) {
  const res = await fetch(`${BACKEND_URL}/options/${type}/${encodeURIComponent(oldValue)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newValue }),
  });
  return handleResponse(res);
}

export async function addOption(type: 'sePractice' | 'claim', value: string) {
  const res = await fetch(`${BACKEND_URL}/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, value }),
  });
  return handleResponse(res);
}

export async function deleteOption(type: 'sePractice' | 'claim', value: string) {
  const res = await fetch(`${BACKEND_URL}/options/${type}/${encodeURIComponent(value)}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
