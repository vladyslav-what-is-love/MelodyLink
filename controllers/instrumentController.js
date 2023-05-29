const Instrument = require("../models/instrument");

// Контролер для створення інструмента
async function createInstrument(req, res) {
  try {
    console.log(req.body);
    console.log(req.headers);
    const { instrument } = req.body;
    const createdInstrument = await Instrument.createInstrument(instrument);
    res.status(201).json(createdInstrument);
  } catch (error) {
    res.status(500).json({ error: "Unable to create instrument" });
  }
}

// Контролер для отримання інструмента за ідентифікатором
async function getInstrumentById(req, res) {
  try {
    const { instrumentId } = req.params;
    const instrument = await Instrument.getInstrumentById(instrumentId);
    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }
    res.json(instrument);
  } catch (error) {
    res.status(500).json({ error: "Failed to get instrument" });
  }
}

// Контролер для видалення інструмента за ідентифікатором
async function deleteInstrument(req, res) {
  try {
    const { instrumentId } = req.params;
    await Instrument.deleteInstrument(instrumentId);
    res.json({ message: "Instrument deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete instrument" });
  }
}

// Контролер для отримання всіх інструментів
async function getAllInstruments(req, res) {
  try {
    const instruments = await Instrument.getAllInstruments();
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get instruments" });
  }
}

module.exports = {
  createInstrument,
  getInstrumentById,
  deleteInstrument,
  getAllInstruments,
};
