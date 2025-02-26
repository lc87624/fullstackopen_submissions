const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.keys(country.languages).map((languagekey) => (
          <li key={languagekey}>{country.languages[languagekey]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} height="100" />
    </div>
  );
};

export default CountryInfo;
