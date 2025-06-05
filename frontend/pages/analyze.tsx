import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles, updateArticle } from '../utils/api';

const researchTypes = ['Controlled Experiment', 'Case Study', 'Survey', 'Literature Review', 'Meta-Analysis'];
const results = ['Supports Claim', 'Does Not Support Claim', 'Inconclusive'];
const participantTypes = ['Professional Developers', 'Students', 'Mixed'];

export default function AnalyzePage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchArticles().then((data) => {
      const approvedArticles = data
        .filter((a: any) => a.status === 'approved')
        .map((a: any) => ({
          ...a,
          result: a.result || 'Supports Claim',
          researchType: a.researchType || 'Case Study',
          participantType: a.participantType || 'Professional Developers',
        }));
      setArticles(approvedArticles);
    });
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...articles];
    updated[index][field] = value;
    setArticles(updated);
  };

  const handleSubmit = async (index: number) => {
    const article = articles[index];
    await updateArticle(article._id, {
      result: article.result,
      researchType: article.researchType,
      participantType: article.participantType,
      status: 'analyzed',
    });
    alert('Analysis submitted');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analyze Approved Articles</h1>

      <Link href="/" passHref>
        <button style={{ marginBottom: '20px' }}>← Back to Home</button>
      </Link>

      {articles.length === 0 ? (
        <p>No approved articles to analyze.</p>
      ) : (
        articles.map((article, index) => (
          <div
            key={article._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '6px',
              background: '#fafafa',
            }}
          >
            <p><strong>{article.title}</strong> by {article.authors}</p>
            <p>
              <em>{article.journal}</em> — {article.year || 'Year N/A'}
              {article.volume && `, Vol. ${article.volume}`}
              {article.number && `, No. ${article.number}`}
            </p>
            <p>Pages: {article.pages || 'N/A'}</p>
            <p>
              DOI: {article.doi ? (
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue' }}
                >
                  {article.doi}
                </a>
              ) : 'N/A'}
            </p>
            <p><strong>SE Practice:</strong> {article.sePractice || 'N/A'}</p>
            <p><strong>Claim:</strong> {article.claim || 'N/A'}</p>

            <label>Result: </label>
            <select
              value={article.result}
              onChange={(e) => handleChange(index, 'result', e.target.value)}
            >
              {results.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <br />

            <label>Research Type: </label>
            <select
              value={article.researchType}
              onChange={(e) => handleChange(index, 'researchType', e.target.value)}
            >
              {researchTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <br />

            <label>Participant Type: </label>
            <select
              value={article.participantType}
              onChange={(e) => handleChange(index, 'participantType', e.target.value)}
            >
              {participantTypes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <br />

            <button onClick={() => handleSubmit(index)} style={{ marginTop: '10px' }}>
              Submit Analysis
            </button>
          </div>
        ))
      )}
    </div>
  );
}
