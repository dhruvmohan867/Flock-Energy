import apiClient from '../utils/apiClient.js';
async function getMeters(page = 1, search = '') {
  const response = await apiClient.get('/portal/meters/search', {
    params: { page, q: search }
  });
  return response.data;
}
async function getMeterById(meterId) {
  const response = await apiClient.get(`/portal/meters/${meterId}`);
  return response.data;
}
async function getMeterGeo(meterId) {
  const response = await apiClient.get(`/portal/meters/${meterId}/geo`);
  return response.data;
}
async function getMeterEnergy(meterId) {
  const response = await apiClient.get(`/portal/meters/${meterId}/energy`);
  return response.data;
}
export default { getMeters, getMeterById, getMeterGeo, getMeterEnergy };