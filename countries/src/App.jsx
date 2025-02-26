import { useState, useEffect } from "react";
import Result from "./components/Result";
import countryService from "./services/country";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    if (allCountries.length === 0) {
      countryService.getAll().then((respData) => {
        setAllCountries(respData.map((country) => country.name.common));
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
        countryService
          .getCountryInfo(filteredCountries[0])
          .then((countryInfo) => {
            setResults([countryInfo]);
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

  const handleShowClick = (country) => {
    countryService.getCountryInfo(country).then((countryInfo) => { 
      setResults([countryInfo]);
    });
  };

  return (
    <>
      <div>
        <label>find countries </label>
        <input type="text" value={query} onChange={handleQueryChange} />
      </div>
      <Result results={results} handleShowClick={handleShowClick} />
    </>
  );
}

export default App;
