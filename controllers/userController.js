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
    // only include the given user by using $match
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
  // Get a single user
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
      console.log(err)
      res.status(500).json(err);
    }
  },
  // Delete a user and remove them from the social network api
  async deleteUser(req, res) {
    try {
      console.log("_id", req.params.userId)
      const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });

      if (!dbUserData) {
        return res.status(404).json({ message: 'No such user exists or user not found with that ID!' });
      }

      const dbThoughtData = await Thought.findOneAndUpdate(
        { dbUserData: req.params.userId },
        { $pull: { dbUserData: req.params.userId } },
        { new: true }
      );

      if (!dbThoughtData) {
        return res.status(200).json({
          message: 'User deleted, with no thoughts found on their profile',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
    
  // Updating a username and it changes in the social network api
  async updateUser(req, res) {
    try {
      console.log("_id", req.params.userId)
      const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId },{$set: req.body}, {new: true})

      if (!dbUserData) {
        return res.status(404).json({ message: 'No such user exists or user not found with that ID!' });
      }


      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
// Helps add a friend with an associated user within the network DB using their id 
  async addFriend(req, res) {
    try {
      console.log("_id", req.params.userId)
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body.friendId} }, 
        { runValidators: true, new: true }
        );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No such user exists OR user not found with that ID!' });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
// // Helps remove a friend with an associated user within the network DB.
  async removeFriend(req, res) {
    try {
      console.log("_id", req.params.userId)
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId} }, 
        { runValidators: true, new: true }
        );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No such user exists or user not found with that ID!' });
      }

      res.json({ message: 'Friend has now been removed!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
