import { useEffect, useState } from 'react';
import { fetchArticles, updateArticle } from '../utils/api';

const researchTypes = ['Controlled Experiment', 'Case Study', 'Survey', 'Meta-Analysis'];
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
      {articles.length === 0 ? (
        <p>No approved articles to analyze.</p>
      ) : (
        articles.map((article, index) => (
          <div key={article._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
            <p><strong>{article.title}</strong> by {article.authors}</p>

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
