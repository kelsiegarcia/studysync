const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

//Sessions (SessionId, topic, time, participants)


const getAll = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDb()
      .collection("session")
      .find()
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving sessions" });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await mongodb
      .getDb()
      .collection("session")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving session" });
  }
};

  // Create
const createSession = async (req, res) => {
  try {
    const { sessionId, topic, time, participants } = req.body;

    // Validate required fields
    if (!sessionId || !topic || !time || !participants) {
      return res.status(400).json({ error: "Missing required session fields" });
    }

    const newSession = {
      sessionId,
      topic,
      time,
      participants,
    };

    const result = await mongodb
      .getDb()
      .collection("session")
      .insertOne(newSession);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server error creating session" });
  }
};

// Update
const updateSession = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { sessionId, topic, time, participants } = req.body;

    // Require at least one field to update
    if (!sessionId && !topic && !time && !participants) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedFields = {};

    if (sessionId) updatedFields.sessionId = sessionId;
    if (topic) updatedFields.topic = topic;
    if (time) updatedFields.time = time;
    if (participants) updatedFields.participants = participants;

    const result = await mongodb
      .getDb()
      .collection("session")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json({ message: "Session updated" });
  } catch (err) {
    return res.status(500).json({ error: "Server error updating session" });
  }
};

  // Delete
const deleteSession = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await mongodb
      .getDb()
      .collection("session")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting session" });
  }
};



module.exports = {getAll,getSingle,createSession,updateSession,deleteSession};
