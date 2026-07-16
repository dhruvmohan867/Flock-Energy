import meterService from '../services/meterService.js';

async function getMeters(req, res, next) {
  try {
    const { page, search } = req.query;
    const data = await meterService.getMeters(page, search);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getMeterGeo(req, res, next) {
  try {
    const { meterId } = req.params;
    const data = await meterService.getMeterGeo(meterId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getMeterEnergy(req, res, next) {
  try {
    const { meterId } = req.params;
    const data = await meterService.getMeterEnergy(meterId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default { getMeters, getMeterGeo, getMeterEnergy };