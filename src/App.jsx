import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [starData, setStarData] = useState(null);
  const [isLoadingYears, setIsLoadingYears] = useState(true);
  const [isLoadingStar, setIsLoadingStar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setError("");
        const res = await fetch("https://nbastars-backend.jcloud.jedlik.cloud/api/years");
        if (!res.ok) {
          throw new Error("Failed to load years.");
        }

        const data = await res.json();
        setYears(data);

        if (data.length > 0) {
          setSelectedYear(data[0]);
        }
      } catch {
        setError("Could not load years from the backend.");
      } finally {
        setIsLoadingYears(false);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setStarData(null);
      return;
    }

    const fetchStar = async () => {
      try {
        setIsLoadingStar(true);
        setError("");
        const res = await fetch(`https://nbastars-backend.jcloud.jedlik.cloud/api/star/${selectedYear}`);
        if (!res.ok) {
          throw new Error("Star not found.");
        }

        const data = await res.json();
        setStarData(data);
      } catch {
        setStarData(null);
        setError("No star data available for this year.");
      } finally {
        setIsLoadingStar(false);
      }
    };

    fetchStar();
  }, [selectedYear]);

  return (
    <main className="page-wrap">
      <section className="star-card">
        <h1>NBA Star By Year</h1>
        <p className="subtitle">Choose a year to see the featured NBA star.</p>

        <label htmlFor="year" className="field-label">
          Year
        </label>
        <select
          id="year"
          className="year-select"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}
          disabled={isLoadingYears}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {isLoadingYears && <p className="status">Loading years...</p>}
        {isLoadingStar && <p className="status">Loading star...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoadingStar && starData && !error && (
          <article className="result-box">
            <p className="result-year">The star of this year is:</p>
            <h2>{starData.star}</h2>
          </article>
        )}
      </section>
    </main>
  );
}

export default App;
