const express = require("express");
const router = express.Router();
const allPostController = require("../controllers/allPostController");

router.get("/", allPostController.getAllPosts);

module.exports = router;
