const Result = ({ results }) => {
  if (results.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  if (results.length === 1) {
    const result = results[0];
    console.log(Object.keys(result.languages));

    return (
      <div>
        <h1>{result.name}</h1>
        <p>Capital {result.capital}</p>
        <p>Area {result.area}</p>
        <h1>Languages</h1>
        <ul>
          {Object.keys(result.languages).map((languagekey) => (
            <li key={languagekey}>{result.languages[languagekey]}</li>
          ))}
        </ul>
        <img src={result.flags.png} alt={result.flags.alt} height="100" />
      </div>
    );
  }
  return (
    <div>
      {results.map((result) => (
        <div key={result}>{result}</div>
      ))}
    </div>
  );
};

export default Result;
