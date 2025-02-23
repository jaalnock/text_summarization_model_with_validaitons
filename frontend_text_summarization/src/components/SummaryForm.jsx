import { useState } from "react";
import axios from "axios";
import "../css/SummaryForm.css";

function SummaryForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("/api/summarize", { text });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here for summarization..."
          className="textarea"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Processing..." : "Generate Summary"}
        </button>
      </form>

      {loading && (
        <div className="loading-overlay">Processing your text...</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {result && !result.error && (
        <div className="result-container">
          <h2 className="result-title">Summary</h2>
          <p className="result-text">{result.summary}</p>

          <div className="evaluation-section">
            <h2 className="result-title">Evaluation Metrics</h2>
            <p className="result-text">
              <strong>Faithfulness Score:</strong>{" "}
              {result.faithfulness_score.toFixed(4)}
              <span> (Higher is better)</span>
            </p>
            <p className="result-text">
              <strong>Entity Overlap:</strong>{" "}
              {result.entity_overlap.toFixed(4)}
              <span> (Proportion of key entities retained)</span>
            </p>
            <p className="result-text">
              <strong>Sentiment Bias:</strong>{" "}
              {result.sentiment_bias ? "Detected" : "None"}
              <span>
                {" "}
                {result.sentiment_bias
                  ? "(Summary tone differs)"
                  : "(Tone consistent)"}
              </span>
            </p>
          </div>

          <hr className="horizontal-line" />

          <h3 className="result-title">Sentence-by-Sentence Analysis</h3>
          {result.summary_sentences.map((sentence, i) => (
            <div key={i} className="sentence-evaluation">
              <p className="result-text">
                <strong>Sentence {i + 1}:</strong> "{sentence}" <br />
                <strong>Similarity:</strong>{" "}
                {result.max_similarities[i].toFixed(4)}
                <span> (Match with original)</span> <br />
                <strong>Hallucination:</strong>{" "}
                {result.hallucination_flags[i] ? "Possible" : "None"}
                <span>
                  {" "}
                  {result.hallucination_flags[i]
                    ? "(May contain new info)"
                    : "(Accurate)"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SummaryForm;
