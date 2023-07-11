const express = require("express")
const router = express.Router()
const { register, login, logout, profile, tasks, removetask } = require("./auth");
const { protect } = require("../middleware/auth");
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/profile").get(protect, profile);
router.route("/tasks").post(protect, tasks);
router.route("/removetask").put(protect, removetask);
router.route("/logout").get(logout);
module.exports = router