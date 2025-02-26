import CountryInfo from "./CountryInfo";
import ResultItem from "./ResultItem";

const Result = ({ results, handleShowClick }) => {
  if (results.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  if (results.length === 1) {
    return <CountryInfo country={results[0]} />;
  }
  return (
    <div>
      {results.map((result, index) => (
        <ResultItem
          key={index}
          result={result}
          handleShowClick={() => handleShowClick(result)}
        />
      ))}
    </div>
  );
};

export default Result;
