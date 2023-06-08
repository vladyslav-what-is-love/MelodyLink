const Organizer = require("../models/organizer");

// Контролер для створення організатора
const createOrganizer = async (req, res) => {
  const { user_id, company } = req.body;

  try {
    const organizer = await Organizer.createOrganizer(user_id, company);
    res.status(201).json(organizer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create organizer" });
  }
};

// Контролер для отримання організатора за ідентифікатором
const getOrganizerById = async (req, res) => {
  const { organizer_id } = req.params;

  try {
    const organizer = await Organizer.getOrganizerById(organizer_id);
    if (organizer) {
      res.json(organizer);
    } else {
      res.status(404).json({ error: "Organizer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get organizer" });
  }
};

// Контролер для оновлення організатора
const updateOrganizer = async (req, res) => {
  const { organizer_id } = req.params;
  const { user_id, company } = req.body;

  try {
    const updates = { user_id, company };
    const organizer = await Organizer.updateOrganizer(organizer_id, updates);
    if (organizer) {
      res.json(organizer);
    } else {
      res.status(404).json({ error: "Organizer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update organizer" });
  }
};

// Контролер для видалення організатора
const deleteOrganizer = async (req, res) => {
  const { organizer_id } = req.params;

  try {
    await Organizer.deleteOrganizer(organizer_id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete organizer" });
  }
};

// Контролер для пошуку організаторів за компанією
const searchOrganizersByCompany = async (req, res) => {
  const { company } = req.query;

  try {
    const organizers = await Organizer.searchOrganizersByCompany(company);
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: "Failed to search organizers" });
  }
};

// Контролер для отримання всіх організаторів
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.getAllOrganizers();
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get organizers" });
  }
};

// Контролер для отримання всіх компаній
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Organizer.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to get companies" });
  }
};

module.exports = {
  createOrganizer,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
  searchOrganizersByCompany,
  getAllOrganizers,
  getAllCompanies,
};
