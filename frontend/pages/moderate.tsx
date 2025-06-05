import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles, updateArticleStatus } from '../utils/api';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  sePractice?: string;
  claim?: string;
  status: string;
}

export default function ModeratePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        setArticles(data.filter((article: Article) => article.status === 'pending'));
      })
      .catch(() => alert('Failed to fetch articles'))
      .finally(() => setLoading(false));
  }, []);

  const handleModeration = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateArticleStatus(id, status);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Failed to update article status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Moderate Articles</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Moderate Articles</h1>

      <Link href="/" passHref>
        <button style={{ marginBottom: 20 }}>← Back to Home</button>
      </Link>

      {articles.length === 0 ? (
        <p>No articles pending moderation.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            style={{
              marginBottom: 20,
              border: '1px solid #ccc',
              padding: 15,
              borderRadius: 6,
              background: '#fafafa',
            }}
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
              DOI:{' '}
              {article.doi ? (
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue' }}
                >
                  {article.doi}
                </a>
              ) : (
                'N/A'
              )}
            </p>
            <p>
              <strong>SE Practice:</strong> {article.sePractice || 'N/A'}
            </p>
            <p>
              <strong>Claim:</strong> {article.claim || 'N/A'}
            </p>

            <button
              onClick={() => handleModeration(article._id, 'approved')}
              disabled={updatingId === article._id}
              aria-label={`Approve article titled ${article.title}`}
            >
              Approve
            </button>
            <button
              onClick={() => handleModeration(article._id, 'rejected')}
              style={{ marginLeft: 10 }}
              disabled={updatingId === article._id}
              aria-label={`Reject article titled ${article.title}`}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
