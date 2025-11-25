
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;




//Progress(id,AuthorID,Topic,SessionCount,HostCount,Streak,Goals)



const getAll = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDb()
      .collection("progress")
      .find()
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving progress" });
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
      .collection("progress")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving progress" });
  }
};

  // Create
const createProgress = async (req, res) => {
  try {
    const task = {
      id: req.body.title,
      AuthorID: req.user._id,
      Topic: req.body.title,
      SessionCount: req.body.title,
      HostCount: req.body.title,
      Streak: req.body.title,
      Goals: req.body.title
    };

    const response = await mongodb
      .getDb()
      .collection("progress")
      .insertOne(task);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json("error while creating the task.");
    }
  } catch (err) {
    res.status(500).json({ error: "Server error creating progress" });
  }
};


// Update
const updateProgress = async (req, res) => {
  try {
    const progressId = req.params.id;

    if (!ObjectId.isValid(progressId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Missing required field 'title'" });
    }

    const updateFields = {
      id: title,
      Topic: title,
      SessionCount: title,
      HostCount: title,
      Streak: title,
      Goals: title
    };

    const result = await mongodb
      .getDb()
      .collection("progress")
      .updateOne(
        { _id: new ObjectId(progressId) },
        { $set: updateFields }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    return res.status(200).json({ message: "Progress updated" });
  } catch (err) {
    return res.status(500).json({ error: "Server error updating progress" });
  }
};


  // Delete
const deleteProgress = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await mongodb
      .getDb()
      .collection("progress")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Progress not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting progress" });
  }
};




module.exports = {getAll,getSingle,createProgress,updateProgress,deleteProgress};
