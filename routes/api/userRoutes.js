const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser).delete(deleteUser);

router.route("/:userId").get(getSingleUser);

router.route("/:userId/friends/:friendId").put(addFriend).delete(removeFriend);

module.exports = router;
