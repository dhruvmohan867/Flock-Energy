import apiClient from '../utils/apiClient.js';
async function getTransformers(page = 1) {
  const response = await apiClient.get('/portal/dts', {
    params: { page }
  });
  return response.data;
}
export default { getTransformers };