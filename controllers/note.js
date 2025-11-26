
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;




//Notes (NotesId,SessionId,AuthorID,Content,timestamp)




const getAll = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDb()
      .collection("note")
      .find()
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving notes" });
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
      .collection("note")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving note" });
  }
};

//Create
const createNote = async (req, res) => {
  try {
    const task = {
      notesId: req.body.notesId,
      sessionId: req.body.sessionId,
      authorId: req.user._id,
      content: req.body.content || '',
      timestamp: new Date()
    };

    const response = await mongodb
      .getDb()
      .collection('note')
      .insertOne(task);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Error creating note.');
    }

  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
};



// Update
const updateNote = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { sessionId, authorId, content, timestamp } = req.body;

    if (!sessionId || !authorId || !content || !timestamp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const noteId = new ObjectId(id);

    const result = await mongodb
      .getDb()
      .collection("note")
      .updateOne(
        { _id: noteId },
        { $set: { sessionId, authorId, content, timestamp } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json({ message: "Note updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error updating note" });
  }
};


  // Delete
const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const noteId = new ObjectId(id);

    const result = await mongodb
      .getDb()
      .collection("note")
      .deleteOne({ _id: noteId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting note" });
  }
};




module.exports = {getAll,getSingle,createNote,updateNote,deleteNote};
