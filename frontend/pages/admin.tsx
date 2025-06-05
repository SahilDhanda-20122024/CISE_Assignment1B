// pages/admin.tsx
import React, { useEffect, useState } from 'react';
import { fetchArticles, updateArticle } from '../utils/api';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  status: string;
  claim: string;
  sePractice: string;
  researchType?: string;
  result?: string;
  participantType?: string;
  // add other fields as needed
}

const editableStatuses = ['approved', 'rejected', 'analyzed'];

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticles, setEditingArticles] = useState<Record<string, Article>>({});

  useEffect(() => {
    async function loadArticles() {
      try {
        const allArticles = await fetchArticles();
        const filtered = allArticles.filter((a: { status: string; }) => editableStatuses.includes(a.status));
        setArticles(filtered);
        // Initialize editingArticles state
        const editMap: Record<string, Article> = {};
        filtered.forEach((a: Article) => (editMap[a._id] = { ...a }));
        setEditingArticles(editMap);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      }
    }
    loadArticles();
  }, []);

  // Handle input changes for each article field
  function handleChange(id: string, field: keyof Article, value: any) {
    setEditingArticles((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  // Save the article changes to backend
  async function handleSave(id: string) {
  try {
    await updateArticle(id, editingArticles[id]);
    alert('Article updated successfully');
  } catch (err) {
    console.error(err);
    alert('Update failed');
  }
}

  return (
    <div>
      <h1>Admin - Edit Articles</h1>
      {articles.length === 0 ? (
        <p>No articles found with status approved, rejected or analyzed.</p>
      ) : (
        articles.map(({ _id }) => {
          const article = editingArticles[_id];
          if (!article) return null;
          return (
            <div key={_id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
              <label>
                Title:{' '}
                <input
                  type="text"
                  value={article.title || ''}
                  onChange={(e) => handleChange(_id, 'title', e.target.value)}
                />
              </label>
              <br />
              <label>
                Author:{' '}
                <input
                  type="text"
                  value={article.authors || ''}
                  onChange={(e) => handleChange(_id, 'authors', e.target.value)}
                />
              </label>
              <br />
              <label>
                Journal:{' '}
                <input
                  type="text"
                  value={article.journal || ''}
                  onChange={(e) => handleChange(_id, 'journal', e.target.value)}
                />
              </label>
              <br />
              <label>
                Year:{' '}
                <input
                  type="number"
                  value={article.year || ''}
                  onChange={(e) => handleChange(_id, 'year', Number(e.target.value))}
                />
              </label>
              <br />
              <label>
                Status:{' '}
                <select
                  value={article.status}
                  onChange={(e) => handleChange(_id, 'status', e.target.value)}
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="analyzed">Analyzed</option>
                </select>
              </label>
              <br />
              <label>
                SE Practice:{' '}
                <input
                  type="text"
                  value={article.sePractice || ''}
                  onChange={(e) => handleChange(_id, 'sePractice', e.target.value)}
                />
              </label>
              <br />
              <label>
                Claim:{' '}
                <input
                  type="text"
                  value={article.claim || ''}
                  onChange={(e) => handleChange(_id, 'claim', e.target.value)}
                />
              </label>
              <br />
              <label>
                Research Type:{' '}
                <input
                  type="text"
                  value={article.researchType || ''}
                  onChange={(e) => handleChange(_id, 'researchType', e.target.value)}
                />
              </label>
              <br />
              <label>
                Result:{' '}
                <input
                  type="text"
                  value={article.result || ''}
                  onChange={(e) => handleChange(_id, 'result', e.target.value)}
                />
              </label>
              <br />
              <label>
                Participant Type:{' '}
                <input
                  type="text"
                  value={article.participantType || ''}
                  onChange={(e) => handleChange(_id, 'participantType', e.target.value)}
                />
              </label>
              <br />
              <button onClick={() => handleSave(_id)}>Save</button>
            </div>
          );
        })
      )}
    </div>
  );
}
