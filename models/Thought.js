const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

<<<<<<< HEAD
// Schema to create a thought model
=======
// Schema to create a Thought model schema
>>>>>>> 0e824c3c98576a4db2173c5d95b505c02e70b982
const thoughtSchema = new Schema(
  {
    thoughtText: [{
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
