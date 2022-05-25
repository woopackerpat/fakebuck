const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../middlewares/upload");

router.post('/', upload.single('image'),postController.createPost)
router.post('/:postId/like', postController.createLike)

module.exports = router;