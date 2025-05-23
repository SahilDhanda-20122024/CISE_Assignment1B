import { useState } from 'react';
import { submitArticle } from '../utils/api';
import { useRouter } from 'next/router';

export default function SubmitPage() {
  const router = useRouter();

  const sePractices = [
    "Test-Driven Development",
    "Pair Programming",
    "Code Reviews",
    "Continuous Integration"
  ];

  const claims = [
    "Improves code quality",
    "Reduces bugs",
    "Increases development speed",
    "Improves team collaboration"
  ];

  const [form, setForm] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    status: 'pending',
    sePractice: 'Test Driven Development',
    claim: 'Improves Code Quality',
    result: 'unverified',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitArticle({
      ...form,
      year: Number(form.year) || undefined
    });
    router.push('/');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Submit an Article</h1>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Title', name: 'title' },
          { label: 'Authors', name: 'authors' },
          { label: 'Journal', name: 'journal' },
          { label: 'Year', name: 'year' },
          { label: 'Volume', name: 'volume' },
          { label: 'Number', name: 'number' },
          { label: 'Pages', name: 'pages' },
          { label: 'DOI', name: 'doi' },
        ].map(field => (
          <div key={field.name} style={{ marginBottom: '10px' }}>
            <label>
              {field.label}:{" "}
              <input
                type="text"
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required={["title", "authors", "journal", "doi"].includes(field.name)}
              />
            </label>
          </div>
        ))}

        <div style={{ marginBottom: '10px' }}>
          <label>
            SE Practice:
            <select name="sePractice" value={form.sePractice} onChange={handleChange}>
              {sePractices.map((practice) => (
                <option key={practice} value={practice}>{practice}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Claim:
            <select name="claim" value={form.claim} onChange={handleChange}>
              {claims.map((claim) => (
                <option key={claim} value={claim}>{claim}</option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
