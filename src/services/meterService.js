import apiClient from '../utils/apiClient.js';

async function getMeters(page = 1, search = '') {
  const response = await apiClient.get('/portal/meters/search', {
    params: { page, q: search }
  });
  return response.data;
}

async function getMeterById(meterId) {
  const response = await apiClient.get('/portal/meters/search', {
    params: { page: 1, q: meterId }
  });
  const meter = response.data.data?.find(m => m.meterId === meterId);
  if (!meter) {
    const error = new Error('Meter not found');
    error.status = 404;
    throw error;
  }
  return meter;
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