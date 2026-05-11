import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  try {
    const request = await axios.get(baseUrl)
    return request.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const create = async (newBlog) => {
  try {
    const request = await axios.post(baseUrl, newBlog, {
      headers: {
        'Authorization': token
      }
    })
    return request.data
  } catch (error) {
    console.error('Error creating blog:', error.response?.data || error.message)
    throw error
  }
}

const update = async (id, updatedBlog) => {
  try {
    const request = await axios.put(`${baseUrl}/${id}`, updatedBlog, {
      headers: {
        'Authorization': token
      }
    })
    return request.data
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message)
    throw error
  }
}

export default { getAll, create, update, setToken }