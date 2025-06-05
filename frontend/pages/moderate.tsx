import { useEffect, useState } from 'react';
import Link from 'next/link';
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

      <Link href="/" passHref>
        <button style={{ marginBottom: '20px' }}>← Back to Home</button>
      </Link>

      {articles.length === 0 ? (
        <p>No articles pending moderation.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '6px', background: '#fafafa' }}
          >
            <p>
              <strong>{article.title}</strong> by {article.authors}
            </p>
            <p>
              <em>{article.journal}</em> — {article.year || 'Year N/A'}
              {article.volume && `, Vol. ${article.volume}`}
              {article.number && `, No. ${article.number}`}
            </p>
            <p>Pages: {article.pages || 'N/A'}</p>
            <p>
              DOI: {article.doi ? (
                <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                  {article.doi}
                </a>
              ) : 'N/A'}
            </p>
            <p><strong>SE Practice:</strong> {article.sePractice || 'N/A'}</p>
            <p><strong>Claim:</strong> {article.claim || 'N/A'}</p>

            <button onClick={() => handleModeration(article._id, 'approved')}>Approve</button>
            <button onClick={() => handleModeration(article._id, 'rejected')} style={{ marginLeft: '10px' }}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
