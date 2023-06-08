const pool = require("../db");
const Instrument = require("../models/instrument");
const Musician = require("../models/musician");
const Organizer = require("../models/organizer");
const CooperationRequest = require("../models/cooperationRequest");

class CooperationRequestController {
  static async createCooperationRequest(req, res) {
    try {
      const { musician_id, organizer_id, request_date, status } = req.body;
      const createdRequest = await CooperationRequest.createCooperationRequest(
        musician_id,
        organizer_id,
        request_date,
        status
      );
      res.status(201).json(createdRequest);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create cooperation request" });
    }
  }

  static async getCooperationRequestById(req, res) {
    try {
      const { requestId } = req.params;
      const request = await CooperationRequest.getCooperationRequestById(
        requestId
      );
      res.json(request);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get cooperation request" });
    }
  }

  static async updateCooperationRequest(req, res) {
    try {
      const { requestId } = req.params;
      const updates = req.body;
      const updatedRequest = await CooperationRequest.updateCooperationRequest(
        requestId,
        updates
      );
      res.json(updatedRequest);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update cooperation request" });
    }
  }

  static async deleteCooperationRequest(req, res) {
    try {
      const { request_id } = req.params;
      await CooperationRequest.deleteCooperationRequest(request_id);
      res.json({ message: "Request deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cooperation request" });
    }
  }

  static async getRequestsByMusicianId(req, res) {
    try {
      const { musician_id } = req.params;
      const requests = await CooperationRequest.getRequestsByMusicianId(
        musician_id
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to get requests by musician ID" });
    }
  }

  static async getRequestsByOrganizerId(req, res) {
    try {
      const { organizer_id } = req.params;
      const requests = await CooperationRequest.getRequestsByOrganizerId(
        organizer_id
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to get requests by organizer ID" });
    }
  }

  static async getCooperationRequestsByStatus(req, res) {
    try {
      const { status } = req.params;
      const requests = await CooperationRequest.getCooperationRequestsByStatus(
        status
      );
      res.json(requests);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get cooperation requests by status" });
    }
  }

  static async getMusician(req, res) {
    try {
      const { request_id } = req.params;
      const request = await CooperationRequest.getCooperationRequestById(
        request_id
      );
      const musician = await request.getMusician();
      res.json(musician);
    } catch (error) {
      res.status(500).json({ error: "Failed to get musician" });
    }
  }

  static async getOrganizer(req, res) {
    try {
      const { request_id } = req.params;
      const request = await CooperationRequest.getCooperationRequestById(
        request_id
      );
      const organizer = await request.getOrganizer();
      res.json(organizer);
    } catch (error) {
      res.status(500).json({ error: "Failed to get organizer" });
    }
  }

  static async getRequestsByDate(req, res) {
    try {
      const { request_date } = req.params;
      const requests = await CooperationRequest.getRequestsByDate(request_date);
      res.json(requests);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get cooperation requests by date" });
    }
  }

  static async getAllCooperationRequests(req, res) {
    try {
      const requests = await CooperationRequest.getAllCooperationRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to get all cooperation requests" });
    }
  }
}

module.exports = CooperationRequestController;
