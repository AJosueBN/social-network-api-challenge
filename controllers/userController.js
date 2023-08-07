const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate function to get the number of users overall
const userCount = async () => {
  const numberOfUsers = await User.aggregate()
    .count('userCount');
  return numberOfUsers;
}

// Aggregate function for getting the overall reactions using $avg
const reactions = async (userId) =>
  User.aggregate([
    // only include the given student by using $match
    { $match: { _id: new ObjectId(userId) } },
    {
      $unwind: '$reactions',
    },
    {
      $group: {
        _id: new ObjectId(userId),
        overallReactions: { $avg: '$reactions.score' },
      },
    },
  ]);

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find()
      .select('-__v')
      
      const userObj = {
        dbUserData,
        userCount: await userCount(),
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleUser(req, res) {
    try {
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with that ID!' })
      }

      res.json({
        dbUserData,
        reactions: await reactions(req.params.userId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and remove them from the social network
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndRemove({ _id: req.params.userId });

      if (!dbUserData) {
        return res.status(404).json({ message: 'No such user exists!' });
      }

      const dbThoughtData = await Thought.findOneAndUpdate(
        { students: req.params.studentId },
        { $pull: { dbUserData: req.params.userId } },
        { new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({
          message: 'Thought deleted, but no users found',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction for a user
  async addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);

    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.usertId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove a reaction from a user
  async removeReaction(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { assignment: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
