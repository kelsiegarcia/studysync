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
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await mongodb
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving user" });
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
    return res.status(200).json({ message: "User deleted successfully" });

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

module.exports = { getAllUsers, getUserById, deleteUser, findOrCreateGoogleUser };
