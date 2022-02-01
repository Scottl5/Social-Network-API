const { User, Thought, Reaction } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "No user found with that Id, but thought was created",
            })
          : res.json("Thought has been created")
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought was found with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  removeThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought was found with this ID" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: req.params.id } }
            )
      )
      .then(() => res.json({ message: "Thought has been deleted" }))
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $push: {
          reactions: {
            reactionText: req.body.reactionText,
            username: req.body.username,
          },
        },
      },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "failed creating reaction" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No reaction found with that Id" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
