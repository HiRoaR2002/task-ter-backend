const User = require("../model/User");
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {
  const { username, password } = req.body


  if (!username || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  const userExist = await User.findOne({ username })

  if (userExist) {
    throw new Error("User Already Exists");
  } else {
    try {
      bcrypt.hash(password, 10)
        .then(async (hash) => {
          await User.create({
            username,
            password: hash,
          })
            .then((user) => {
              const maxAge = 3 * 60 * 60;
              const token = jwt.sign(
                { id: user._id, username, role: user.role },
                process.env.JWT_SECRET,
                {
                  expiresIn: maxAge, // 3hrs in sec
                }
              );
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
              });
              res.status(201).json({
                message: "User successfully created",
                user: user._id,
              });
            });
        })
    } catch (err) {
      res.status(401).json({
        message: "User not successful created",
        error: error.mesage,
      })
    }
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            process.env.JWT_SECRET,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
            isAuth: true,
          });

        } else {
          res.status(400).json({
            message: "Login not succesful",
            isAuth: false
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }

}

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json(user)
  } else {
    res.status(404).json("user not found")
  }
}


exports.tasks = async (req, res) => {
  const { taskname, userId } = req.body;
  if (!taskname || !userId) {
    res.status(400);
    throw new Error("Please Enter the all the fields");
  }

  const taskExist = await User.findOne({ _id: userId, task: taskname })

  if (taskExist) {
    res.status(400).json(
      { message: "Task Already Present" })
  } else {
    try {
      const added = await User.findByIdAndUpdate(
        userId, {
        $push: { task: taskname }
      }, { new: true }
      )
      if (added) {
        
        res.status(200).json("Task Successfully added");

      } else {
        throw new Error("task not found");
      }
    } catch {
      res.status(400);
      throw new Error("Task not created");
    }
  }

}

exports.removetask = async (req, res) => {
  const { userId, taskname } = req.body;
  try {
    const removed = await User.findByIdAndUpdate(
      userId, {
      $pull: { task: taskname }
    }, { new: true }
    )
    if (removed) {
      res.status(200).json("Task Successfully Removed");
    } else {
      res.json("Task Not Found");
    }
  } catch {
    res.status(400);
    res.json({ message: "Task Not Deleted" });
  }
}


exports.logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json("LOGGED OUT");
}
