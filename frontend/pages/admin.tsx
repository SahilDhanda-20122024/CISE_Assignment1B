import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchArticles,
  fetchOptions,
  updateArticle,
  addOption,
  deleteOption,
  updateOption,
} from "../utils/api";

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  sePractice?: string;
  claim?: string;
  result?: string;
  researchType?: string;
  participantType?: string;
  status: "approved" | "rejected" | "analyzed";
  tempStatus?: "approved" | "rejected" | "analyzed"; // new temp field
}

interface Options {
  sePractices: string[];
  claims: string[];
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [options, setOptions] = useState<Options>({
    sePractices: [],
    claims: [],
  });

  const [filterStatus, setFilterStatus] = useState<
    "approved" | "rejected" | "analyzed" | "any"
  >("analyzed");
  const [searchTerm, setSearchTerm] = useState("");

  const [newPractice, setNewPractice] = useState("");
  const [newClaim, setNewClaim] = useState("");

  useEffect(() => {
    fetchArticles().then((data: Article[]) => {
      const filtered = data
        .filter((a) => ["approved", "rejected", "analyzed"].includes(a.status))
        .map((a) => ({ ...a, tempStatus: a.status })); // copy status to tempStatus
      setArticles(filtered);
    });

    fetchOptions().then(setOptions);
  }, []);

  const refreshOptions = () => {
    fetchOptions().then(setOptions);
  };

  const handleChange = (id: string, field: keyof Article, value: string) => {
    setArticles((prev) =>
      prev.map((article) =>
        article._id === id ? { ...article, [field]: value } : article
      )
    );
  };

  const handleSave = (article: Article) => {
    const updated = {
      ...article,
      status: article.tempStatus || article.status,
    };
    updateArticle(article._id, updated).then(() => {
      setArticles((prev) =>
        prev.map((a) =>
          a._id === article._id ? { ...updated, tempStatus: updated.status } : a
        )
      );
    });
  };

  // Editable option handlers for SE Practices and Claims

  const handleOptionEdit = (
    type: "sePractice" | "claim",
    oldValue: string,
    newValue: string
  ) => {
    if (!newValue.trim()) return; // don't allow empty
    if (newValue === oldValue) return; // no change
    updateOption(type, oldValue, newValue).then(() => {
      refreshOptions();
    });
  };

  const handleOptionDelete = async (
    type: "sePractice" | "claim",
    value: string
  ) => {
    await deleteOption(type, value);
    refreshOptions();
  };

  const handleAddOption = async (
    type: "sePractice" | "claim",
    value: string
  ) => {
    if (!value.trim()) return;
    await addOption(type, value.trim());
    refreshOptions();
    if (type === "sePractice") setNewPractice("");
    else setNewClaim("");
  };

  function renderSelectWithCurrent(
    currentValue: string | undefined,
    optionsList: string[],
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    placeholder: string
  ) {
    const opts =
      currentValue && !optionsList.includes(currentValue)
        ? [currentValue, ...optionsList]
        : optionsList;

    return (
      <select value={currentValue || ""} onChange={onChange}>
        <option value="">{placeholder}</option>
        {opts.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  const filteredArticles = articles.filter((a) => {
    const matchesStatus = filterStatus === "any" || a.status === filterStatus;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      a.title?.toLowerCase().includes(search) ||
      a.authors?.toLowerCase().includes(search) ||
      a.journal?.toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Page - Edit Articles</h1>

      <Link href="/" passHref>
        <button style={{ marginBottom: "20px" }}>← Back to Home</button>
      </Link>

      {/* Filter & Search */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <label>
          Filter by Status:{" "}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "approved" | "rejected" | "analyzed" | "any"
              )
            }
          >
            <option value="any">Any</option>
            <option value="analyzed">Analyzed</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
          </select>
        </label>

        <label>
          Search:{" "}
          <input
            type="text"
            placeholder="Title, Author, Journal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
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
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.length === 0 ? (
            <tr>
              <td colSpan={10}>No articles to display.</td>
            </tr>
          ) : (
            filteredArticles.map((article) => (
              <tr key={article._id}>
                <td>
                  <input
                    value={article.title}
                    onChange={(e) =>
                      handleChange(article._id, "title", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={article.authors}
                    onChange={(e) =>
                      handleChange(article._id, "authors", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={article.journal}
                    onChange={(e) =>
                      handleChange(article._id, "journal", e.target.value)
                    }
                  />
                </td>
                <td>
                  {renderSelectWithCurrent(
                    article.sePractice,
                    options.sePractices,
                    (e) =>
                      handleChange(article._id, "sePractice", e.target.value),
                    "Select SE Practice"
                  )}
                </td>
                <td>
                  {renderSelectWithCurrent(
                    article.claim,
                    options.claims,
                    (e) => handleChange(article._id, "claim", e.target.value),
                    "Select Claim"
                  )}
                </td>
                <td>
                  {renderSelectWithCurrent(
                    article.result,
                    [
                      "Supports Claim",
                      "Does Not Support Claim",
                      "Inconclusive",
                    ],
                    (e) => handleChange(article._id, "result", e.target.value),
                    "Select Result"
                  )}
                </td>
                <td>
                  {renderSelectWithCurrent(
                    article.researchType,
                    [
                      "Experiment",
                      "Case Study",
                      "Survey",
                      "Literature Review",
                      "Meta-Analysis",
                    ],
                    (e) =>
                      handleChange(article._id, "researchType", e.target.value),
                    "Select Research Type"
                  )}
                </td>
                <td>
                  {renderSelectWithCurrent(
                    article.participantType,
                    ["Students", "Professional Developers", "Mixed"],
                    (e) =>
                      handleChange(
                        article._id,
                        "participantType",
                        e.target.value
                      ),
                    "Select Participant Type"
                  )}
                </td>
                <td>
                  <select
                    value={article.tempStatus}
                    onChange={(e) =>
                      handleChange(
                        article._id,
                        "tempStatus",
                        e.target.value as "approved" | "rejected" | "analyzed"
                      )
                    }
                  >
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="analyzed">Analyzed</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleSave(article)}>Save</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Manage Options */}
      <div style={{ marginTop: "40px" }}>
        <h2>Manage SE Practices and Claims</h2>

        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "flex-start",
          }}
        >
          {/* SE Practice Editor */}
          <div>
            <h3>SE Practices</h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "8px",
                width: "250px",
              }}
            >
              {options.sePractices.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                    gap: "8px",
                  }}
                >
                  <input
                    type="text"
                    defaultValue={item}
                    onBlur={(e) =>
                      handleOptionEdit("sePractice", item, e.target.value)
                    }
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    onClick={() => handleOptionDelete("sePractice", item)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                    title="Delete SE Practice"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "10px" }}>
              <input
                value={newPractice}
                onChange={(e) => setNewPractice(e.target.value)}
                placeholder="Add new SE Practice"
                style={{ width: "200px" }}
              />
              <button
                onClick={() => handleAddOption("sePractice", newPractice)}
                style={{ marginLeft: "6px" }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Claims Editor */}
          <div>
            <h3>Claims</h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "8px",
                width: "250px",
              }}
            >
              {options.claims.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                    gap: "8px",
                  }}
                >
                  <input
                    type="text"
                    defaultValue={item}
                    onBlur={(e) =>
                      handleOptionEdit("claim", item, e.target.value)
                    }
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    onClick={() => handleOptionDelete("claim", item)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                    title="Delete Claim"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "10px" }}>
              <input
                value={newClaim}
                onChange={(e) => setNewClaim(e.target.value)}
                placeholder="Add new Claim"
                style={{ width: "200px" }}
              />
              <button
                onClick={() => handleAddOption("claim", newClaim)}
                style={{ marginLeft: "6px" }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
