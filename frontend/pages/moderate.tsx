import { useEffect, useState } from 'react';
import { fetchArticles, updateArticleStatus } from '../utils/api';

export default function ModeratePage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchArticles().then((data) =>
      setArticles(data.filter((article: { status: string }) => article.status === 'pending'))
    );
  }, []);

  const handleModeration = async (id: string, status: string) => {
    try {
      await updateArticleStatus(id, status);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Failed to update article status');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Moderate Articles</h1>
      {articles.length === 0 ? (
        <p>No articles pending moderation.</p>
      ) : (
        articles.map((article) => (
          <div key={article._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <p>
              <strong>{article.title}</strong> by {article.authors}
            </p>
            <button onClick={() => handleModeration(article._id, 'approved')}>Approve</button>
            <button onClick={() => handleModeration(article._id, 'rejected')}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
