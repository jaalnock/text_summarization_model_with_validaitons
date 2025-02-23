import SummaryForm from "./components/SummaryForm";
import "./css/App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Text Summarization & Validation</h1>
      <p className="app-subtitle">
        Summarize your text and validate its accuracy with AI-powered insights.
      </p>
      <SummaryForm />
    </div>
  );
}

export default App;
