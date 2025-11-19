const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;



//Users (AuthorID, name, email, subjects)


const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb
    .getDb()
    .collection('users')
    .find()
    .toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users', details: err });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
    .getDb()
    .collection('users')
    .findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user', details: err });
  }
};


const createUser = async (req, res) => {
  try {
    const { authorID, name, email, subjects } = req.body;
    if (!authorID || !name || !email || !subjects ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newUser = { authorID, name, email, subjects };
    const result = await mongodb
    .getDb()
    .collection('users')
    .insertOne(newUser);
    const user = await mongodb
    .getDb()
    .collection('users')
    .findOne({ _id: result.insertedId });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err });
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
    .getDb()
    .collection('users')
    .deleteOne({ _id: userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err });
  }
};


// Find or create a Google user (used by Passport)
const findOrCreateGoogleUser = async (profile) => {
  try {
    const usersColl = mongodb.getDb().collection('users');
    const existing = await usersColl.findOne({ provider: 'google', providerId: profile.id });
    if (existing) return existing;

    const newUser = {
      provider: 'google',
      providerId: profile.id,
      authorID: '',
      name: profile.displayName || `${profile.name && profile.name.givenName ? profile.name.givenName : ''} ${profile.name && profile.name.familyName ? profile.name.familyName : ''}`.trim(),
      email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
      subjects: []
    };

    const result = await usersColl.insertOne(newUser);
    const authorId = result.insertedId.toString();
    await usersColl.updateOne({ _id: result.insertedId }, { $set: { authorID: authorId } });
    const created = await usersColl.findOne({ _id: result.insertedId });
    return created;
  } catch (err) {
    throw err;
  }
};

module.exports = { getAllUsers, getUserById, createUser, deleteUser, findOrCreateGoogleUser };
