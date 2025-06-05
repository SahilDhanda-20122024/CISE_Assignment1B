// pages/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles } from '../utils/api';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    sePractice: '',
    claim: '',
    result: '',
    researchType: '',
  });

  useEffect(() => {
    fetchArticles().then(data => {
      const approvedOrAnalyzed = data.filter((a: any) =>
        a.status === 'approved' || a.status === 'analyzed'
      );
      setArticles(approvedOrAnalyzed);
    });
  }, []);

  const handleSearchChange = (e: any) => setSearch(e.target.value.toLowerCase());

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(search) ||
      article.authors.toLowerCase().includes(search) ||
      article.journal.toLowerCase().includes(search);

    const matchesFilters =
      (!filters.sePractice || article.sePractice === filters.sePractice) &&
      (!filters.claim || article.claim === filters.claim) &&
      (!filters.result || article.result === filters.result) &&
      (!filters.researchType || article.researchType === filters.researchType);

    return matchesSearch && matchesFilters;
  });

  const uniqueValues = (key: string) =>
    Array.from(new Set(articles.map(article => article[key]).filter(Boolean)));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Research Articles</h1>

      {/* Navigation Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Link href="/submit">
          <button>Submit Article</button>
        </Link>
        <Link href="/moderate">
          <button>Moderate Articles</button>
        </Link>
        <Link href="/analyze">
          <button>Analyze Articles</button>
        </Link>
        <Link href="/admin">
          <button>Admin Page</button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title, author, journal"
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '5px', width: '300px' }}
        />

        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select name="sePractice" value={filters.sePractice} onChange={handleFilterChange}>
            <option value="">All SE Practices</option>
            {uniqueValues('sePractice').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select name="claim" value={filters.claim} onChange={handleFilterChange}>
            <option value="">All Claims</option>
            {uniqueValues('claim').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select name="result" value={filters.result} onChange={handleFilterChange}>
            <option value="">All Results</option>
            {uniqueValues('result').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select name="researchType" value={filters.researchType} onChange={handleFilterChange}>
            <option value="">All Research Types</option>
            {uniqueValues('researchType').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Article Table */}
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>Journal</th>
            <th>SE Practice</th>
            <th>Claim</th>
            <th>Result</th>
            <th>Research Type</th>
            <th>Participant Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.length === 0 ? (
            <tr>
              <td colSpan={8}>No articles found.</td>
            </tr>
          ) : (
            filteredArticles.map(article => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.authors}</td>
                <td>{article.journal}</td>
                <td>{article.sePractice}</td>
                <td>{article.claim}</td>
                <td>{article.result || '-'}</td>
                <td>{article.researchType || '-'}</td>
                <td>{article.participantType || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
