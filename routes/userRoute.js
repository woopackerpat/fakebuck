const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const upload = require("../middlewares/upload");

router.get("/me", userController.getMe);
router.patch(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  userController.updateProfile
);
router.get("/posts", postController.getUserPost);

module.exports = router;
