const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find()
      .sort({ createdAt: -1});

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a thought
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with that ID!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);

      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      
      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this ID!' });
      }
      res.json({ message: 'Thought successfully created!'});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought with that ID!' });
      }

      res.json({ message: 'Thought has succesfully been deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a reaction for a user within a thought
  async addReaction(req, res) {
    console.log('You are adding a reaction to a thought');
    console.log(req.body);

    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }

      res.json({ message: 'Reaction to the thought has successfully been made :)'});
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove a reaction from a user within their thoughts
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No reaction within that thought found with that ID :(' });
      }

      res.json({ message: 'Reaction to the thought has successfully been deleted!!'});
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
