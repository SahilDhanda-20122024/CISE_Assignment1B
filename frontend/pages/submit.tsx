import { useState } from 'react';
import { useRouter } from 'next/router';
import { createArticle } from '../utils/api';

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

  const sePractices = ['TDD', 'Pair Programming', 'Code Review', 'Continuous Integration'];
  const claims = [
    'Improves Code Quality',
    'Reduces Bugs',
    'Enhances Collaboration',
  ];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createArticle({ ...form, status: 'pending' });
      router.push('/');
    } catch (err) {
      alert('Failed to submit article');
    }
  }

  return (
    <div>
      <h1>Submit a New Article</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit Article</button>
      </form>
    </div>
  );
}
