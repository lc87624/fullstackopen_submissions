import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((response) => {
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.error);
    }
  });
};

const update = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson).then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
