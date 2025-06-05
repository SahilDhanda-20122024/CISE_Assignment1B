import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createArticle, fetchOptions } from '../utils/api';

export default function SubmitPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    sePractice: '',
    claim: '',
  });

  const [sePractices, setSePractices] = useState<string[]>([]);
  const [claims, setClaims] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions()
      .then((opts) => {
        setSePractices(opts.sePractices || []);
        setClaims(opts.claims || []);
        setLoadingOptions(false);
      })
      .catch(() => {
        setError('Failed to load options');
        setLoadingOptions(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createArticle({ ...form, status: 'pending' });
      router.push('/');
    } catch {
      alert('Failed to submit article');
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <Link href="/" passHref>
        <button style={{ marginBottom: '20px' }}>← Back to Home</button>
      </Link>

      <h1>Submit a New Article</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loadingOptions ? (
        <p>Loading options...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="authors" placeholder="Authors" value={form.authors} onChange={handleChange} required />
          <input name="journal" placeholder="Journal" value={form.journal} onChange={handleChange} required />
          <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
          <input name="volume" placeholder="Volume" value={form.volume} onChange={handleChange} />
          <input name="number" placeholder="Number" value={form.number} onChange={handleChange} />
          <input name="pages" placeholder="Pages" value={form.pages} onChange={handleChange} />
          <input name="doi" placeholder="DOI" value={form.doi} onChange={handleChange} required />

          <select name="sePractice" value={form.sePractice} onChange={handleChange} required>
            <option value="">Select SE Practice</option>
            {sePractices.map((practice) => (
              <option key={practice} value={practice}>
                {practice}
              </option>
            ))}
          </select>

          <select name="claim" value={form.claim} onChange={handleChange} required>
            <option value="">Select Claim</option>
            {claims.map((claim) => (
              <option key={claim} value={claim}>
                {claim}
              </option>
            ))}
          </select>

          <button type="submit" style={{ marginTop: '20px' }}>
            Submit Article
          </button>
        </form>
      )}
    </div>
  );
}
