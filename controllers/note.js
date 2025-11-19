
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
      AuthorID: req.body.AuthorID,
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
  const userId = new ObjectId(req.params.id);
    const task = {
      NotesId: req.body.title,
      SessionId: req.body.title,
      AuthorID: req.body.title,
      content: req.body.description || '',
      timestamp: new Date()
    };
  const response = await mongodb
    .getDb()
    .collection('note')
    .replaceOne({ _id: userId }, task);
  console.log(response);
  if (response.modifiedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while Updating the task.');}};


  // Delete
const deleteNote = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('note')
    .deleteOne({ _id: userId });
  console.log(response);
  if (response.deletedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while deleating the task.');}};




module.exports = {getAll,getSingle,createNote,updateNote,deleteNote};
