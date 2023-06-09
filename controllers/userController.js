const User = require("../models/user");

async function createUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      rating,
      image,
      location,
      password,
      roleName,
      entityType,
    } = req.body;

    const createdUser = await User.createUser(
      firstName,
      lastName,
      email,
      phone,
      rating,
      image,
      location,
      password,
      roleName,
      entityType
    );

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to create user" });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.getUserById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to get user" });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const updatedUser = await User.updateUser(userId, updates);

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    await User.deleteUser(userId);

    res.json({ message: "User was deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to delete user" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    //console.log(req.body);
    const user = await User.login(phone, password);

    console.log(user);
    //console.log(user);
    if (user.musician_id) {
      res.json({
        id: user.id,
        role: user.role_name,
        musician_id: user.musician_id,
      });
    } else if (user.organizer_id) {
      res.json({
        id: user.id,
        role: user.role_name,
        organizer_id: user.organizer_id,
      });
    } else {
      res.json({
        id: user.id,
        role: user.role_name,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to log in" });
  }
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  login,
};
