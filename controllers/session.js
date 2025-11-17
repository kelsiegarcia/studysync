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
    const task = {
      SessionId: req.body.title,
      topic: req.body.description || '',
      participants: req.body.completed ,
      starttime: new Date(),
      endtime: new Date()
    };
  const response = await mongodb
    .getDb()
    .collection('session')
    .insertOne(task);
  if (response.acknowledged) {res.status(201).json(response);} 
  else {res.status(500).json(response.error || 'error while creating the task.');}};



// Update
const updateSession = async (req, res) => {
  const userId = new ObjectId(req.params.id);
    const task = {
     SessionId: req.body.title,
      topic: req.body.description || '',
      participants: req.body.completed ,
      starttime: new Date(),
      endtime: new Date()
    };
  const response = await mongodb
    .getDb()
    .collection('session')
    .replaceOne({ _id: userId }, task);
  console.log(response);
  if (response.modifiedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while Updating the task.');}};


  // Delete
const deleteSession = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('session')
    .deleteOne({ _id: userId });
  console.log(response);
  if (response.deletedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while deleating the task.');}};




module.exports = {getAll,getSingle,createSession,updateSession,deleteSession};
