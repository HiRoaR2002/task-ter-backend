const express = require("express")
const router = express.Router()
const { register, login, logout, profile, tasks, removetask } = require("./auth");
const { protect } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
});
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/profile").get(protect, profile);
router.route("/tasks").post(protect, tasks);
router.route("/removetask").put(protect, removetask);
router.route("/logout").get(logout);
module.exports = router