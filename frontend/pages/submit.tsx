import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createArticle, fetchOptions } from "../utils/api";

interface ArticleForm {
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  number: string;
  pages: string;
  doi: string;
  sePractice: string;
  claim: string;
}

export default function SubmitPage() {
  const router = useRouter();

  const [form, setForm] = useState<ArticleForm>({
    title: "",
    authors: "",
    journal: "",
    year: "",
    volume: "",
    number: "",
    pages: "",
    doi: "",
    sePractice: "",
    claim: "",
  });

  const [sePractices, setSePractices] = useState<string[]>([]);
  const [claims, setClaims] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        const opts = await fetchOptions();
        setSePractices(opts.sePractices || []);
        setClaims(opts.claims || []);
      } catch {
        setError("Failed to load options");
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function isYearValid(year: string) {
    return year === "" || /^\d{4}$/.test(year);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isYearValid(form.year)) {
      alert("Please enter a valid 4-digit year or leave blank.");
      return;
    }

    setSubmitting(true);
    try {
      await createArticle({
        ...form,
        status: "pending",
        result: "pending", // Default value
        researchType: "N/A", // Default value
        participantType: "N/A", // Default value
      });
      router.push("/");
    } catch {
      alert("Failed to submit article");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <Link href="/" passHref>
        <button style={{ marginBottom: 20 }}>← Back to Home</button>
      </Link>

      <h1>Submit a New Article</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingOptions ? (
        <p>Loading options...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
          noValidate
        >
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            aria-label="Article title"
          />
          <input
            name="authors"
            placeholder="Authors"
            value={form.authors}
            onChange={handleChange}
            required
            aria-label="Authors"
          />
          <input
            name="journal"
            placeholder="Journal"
            value={form.journal}
            onChange={handleChange}
            required
            aria-label="Journal"
          />
          <input
            name="year"
            placeholder="Year (optional)"
            value={form.year}
            onChange={handleChange}
            aria-label="Year"
          />
          <input
            name="volume"
            placeholder="Volume (optional)"
            value={form.volume}
            onChange={handleChange}
            aria-label="Volume"
          />
          <input
            name="number"
            placeholder="Number (optional)"
            value={form.number}
            onChange={handleChange}
            aria-label="Number"
          />
          <input
            name="pages"
            placeholder="Pages (optional)"
            value={form.pages}
            onChange={handleChange}
            aria-label="Pages"
          />
          <input
            name="doi"
            placeholder="DOI"
            value={form.doi}
            onChange={handleChange}
            required
            aria-label="DOI"
          />

          <select
            name="sePractice"
            value={form.sePractice}
            onChange={handleChange}
            required
            aria-label="Select Software Engineering Practice"
          >
            <option value="">Select SE Practice</option>
            {sePractices.map((practice) => (
              <option key={practice} value={practice}>
                {practice}
              </option>
            ))}
          </select>

          <select
            name="claim"
            value={form.claim}
            onChange={handleChange}
            required
            aria-label="Select Claim"
          >
            <option value="">Select Claim</option>
            {claims.map((claim) => (
              <option key={claim} value={claim}>
                {claim}
              </option>
            ))}
          </select>

          <button type="submit" style={{ marginTop: 20 }} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Article"}
          </button>
        </form>
      )}
    </div>
  );
}
