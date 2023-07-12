const dotenv = require('dotenv');
const cors = require("cors")
const express = require('express');
const connectDB = require('./db');
const userRoutes = require("./Auth/route")
const cookieParser = require("cookie-parser");
const { protect } = require('./middleware/auth');
const logout = require('./Auth/route');
const { profile, tasks } = require('./Auth/auth');
const app = express();
dotenv.config();
const PORT = 5000 || process.env.PORT;
connectDB();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.listen(PORT, console.log(`Server Started at Port:${PORT}`));

app.use("/api/auth", userRoutes, profile, tasks, logout);
app.get("/admin", protect, (req, res) => res.send("Admin Route"));


