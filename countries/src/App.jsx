import { useState, useEffect } from "react";
import axios from "axios";
import Result from "./components/Result";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    if (allCountries.length === 0) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then((resp) => {
          setAllCountries(resp.data.map((country) => country.name.common));
        });
    }
  }, []);

  useEffect(() => {
    if (query === "") {
      setResults([]);
    } else {
      const filteredCountries = allCountries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      if (filteredCountries.length === 1) {
        axios
          .get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`
          )
          .then((resp) => {
            const result = {
              name: resp.data.name.common,
              capital: resp.data.capital,
              area: resp.data.area,
              languages: resp.data.languages,
              flags: resp.data.flags,
            };
            setResults([result]);
          });
      } else {
        setResults(filteredCountries);
      }
    }
  }, [query]);

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };
  return (
    <>
      <div>
        <label>find countries </label>
        <input type="text" value={query} onChange={handleQueryChange} />
      </div>
      <Result results={results} />
    </>
  );
}

export default App;
