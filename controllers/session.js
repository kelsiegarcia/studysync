const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

//Sessions (SessionId, topic, time, participants)


const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().collection('session').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('session')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

  // Create
const createSession = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await mongodb
      .getDb()
      .collection("session")
      .insertOne({ title, description, completed: completed || false });

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

    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await mongodb
      .getDb()
      .collection("session")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, description, completed } }
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

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting session" });
  }
};



module.exports = {getAll,getSingle,createSession,updateSession,deleteSession};
