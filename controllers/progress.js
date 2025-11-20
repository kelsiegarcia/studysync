
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;




//Progress(id,AuthorID,Topic,SessionCount,HostCount,Streak,Goals)



const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().collection('progress').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('progress')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

  // Create
const createProgress = async (req, res) => {
    const task = {
        id: req.body.title,
        AuthorID: new ObjectId(req.user.authorID),
        Topic: req.body.title,
        SessionCount: req.body.title,
        HostCount: req.body.title,
        Streak: req.body.title,
        Goals : req.body.title
    };
  const response = await mongodb
    .getDb()
    .collection('progress')
    .insertOne(task);
  if (response.acknowledged) {res.status(201).json(response);} 
  else {res.status(500).json(response.error || 'error while creating the task.');}};



// Update
const updateProgress = async (req, res) => {
  const userId = new ObjectId(req.params.id);
    const task = {
        id: req.body.title,
        AuthorID: req.body.title,
        Topic: req.body.title,
        SessionCount: req.body.title,
        HostCount: req.body.title,
        Streak: req.body.title,
        Goals : req.body.title
    };
  const response = await mongodb
    .getDb()
    .collection('progress')
    .replaceOne({ _id: userId }, task);
  console.log(response);
  if (response.modifiedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while Updating the task.');}};


  // Delete
const deleteProgress = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('progress')
    .deleteOne({ _id: userId });
  console.log(response);
  if (response.deletedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while deleating the task.');}};




module.exports = {getAll,getSingle,createProgress,updateProgress,deleteProgress};
