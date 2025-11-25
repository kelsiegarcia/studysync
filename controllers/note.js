
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;




//Notes (NotesId,SessionId,AuthorID,Content,timestamp)




const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().collection('note').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('note')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

//Create
const createNote = async (req, res) => {
  try {
    const task = {
      NotesId: req.body.NotesId,
      SessionId: req.body.SessionId,
      AuthorID: req.user._id,
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

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const noteId = new ObjectId(id);

    const result = await mongodb
      .getDb()
      .collection("note")
      .updateOne(
        { _id: noteId },
        { $set: { title, content } }
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

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting note" });
  }
};




module.exports = {getAll,getSingle,createNote,updateNote,deleteNote};
