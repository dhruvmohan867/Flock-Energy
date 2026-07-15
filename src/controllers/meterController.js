import meterService from '../services/meterService.js';

async function search(req, res, next) {
  try {
    const data = await meterService.search(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getGeo(req, res, next) {
  try {
    const data = await meterService.getGeo(req.params.meterId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getEnergy(req, res, next) {
  try {
    const data = await meterService.getEnergy(req.params.meterId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default { search, getGeo, getEnergy };
