import axios from "axios";

const countryService = {
  getAll: () => {
    return axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        return response.data;
      });
  },
  getCountryInfo: (country) => {
    return axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then((resp) => {
        const countryInfo = {
          name: resp.data.name.common,
          capital: resp.data.capital,
          area: resp.data.area,
          languages: resp.data.languages,
          flags: resp.data.flags,
        };
        return countryInfo;
      });
  },
};

export default countryService;
