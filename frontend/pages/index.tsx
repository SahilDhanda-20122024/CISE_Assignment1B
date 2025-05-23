import { useEffect, useState } from 'react';
import { fetchArticles } from '../utils/api';
import Link from 'next/link';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch((err) => {
        console.error("Failed to fetch articles", err);
        setArticles([]);
      });
  }, []);

  return (
    <div>
      <h1>Submitted Articles</h1>
      
      <Link href="/submit">
        <button style={{ marginBottom: '20px' }}>Submit New Article</button>
      </Link>

      <ul>
        {articles.length === 0 ? (
          <li>No articles found</li>
        ) : (
          articles.map((a, index) => (
            <li key={index}>
              <strong>{a.title}</strong> by {a.authors} ({a.year})<br />
              Journal: {a.journal} | Claim: {a.claim} | Result: {a.result}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
