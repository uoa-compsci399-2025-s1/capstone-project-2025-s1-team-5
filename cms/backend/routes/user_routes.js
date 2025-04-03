import { Router } from "express";

const userRouter = Router();

// Dummy data
const users = [
  { uid: 1 ,name: "Leon Huang", email: "lhua@aucklanduni.ac.nz", gender: "M", age: 21, degree: "CompSci" },
  { uid: 2 ,name: "Andy Xu", email: "axu@aucklanduni.ac.nz", gender: "M", age: 21, degree: "CompSci" },
];

// Get all users
userRouter.get('/users', (req, res) => {
    res.send({ body: { title: "Get all users", data: users } });
});

// Get user
userRouter.get('/users/:uid', (req, res) => {
  const uid = parseInt(req.params.uid, 10);
  const user = users.find(u => u.uid === uid);

  if (user) {
    res.send({ body: { title: "Get user", data: user } });
  } else {
    res.status(404).send({ body: { title: "User not found" } });
  }
});

// Create new user
userRouter.post('/users', (req, res) => {
    const { uid, name, email, gender, age, degree } = req.body;

  if (!uid || !name || !email) {
    return res.status(400).send({ body: { title: "UID, name, and email are required" } });
  }

  const newUser = { uid, name, email, gender, age, degree };
  users.push(newUser);
  res.status(201).send({ body: { title: "User created", data: newUser } });
});

// Update user
userRouter.put('/users/:uid', (req, res) => {
  const uid = parseInt(req.params.uid, 10);
  const { name, email, gender, age, degree } = req.body;

  const userIndex = users.findIndex(u => u.uid === uid);

  if (userIndex !== -1) {
    users[userIndex] = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
        ...(gender && { gender }),
        ...(age && { age }),
        ...(degree && { degree }),
    };
    res.send({ body: { title: "User updated", data: users[userIndex] } });
  } else {
    res.status(404).send({ body: { title: "User not found" } });
  }
});

// Delete user
userRouter.delete('/users/:uid', (req, res) => {
    const uid = parseInt(req.params.uid, 10);
    const userIndex = users.findIndex(u => u.uid === uid);
  
    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1)[0];
      res.send({ body: { title: "User deleted", data: deletedUser } });
    } else {
      res.status(404).send({ body: { title: "User not found" } });
    }
});

export default userRouter;