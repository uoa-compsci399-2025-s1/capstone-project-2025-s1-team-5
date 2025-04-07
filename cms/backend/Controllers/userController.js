const users = [
    { email: 1, name: "Leon Huang", email: "lhua@aucklanduni.ac.nz", gender: "M", age: 21, programme: "CompSci" },
    { email: 2, name: "Andy Xu", email: "axu@aucklanduni.ac.nz", gender: "M", age: 21, programme: "CompSci" },
  ];
  
  export const getAllUsers = (req, res) => {
    res.send({ body: { title: "Get all users", data: users } });
  };
  
  export const getUser = (req, res) => {
    const { email } = req.params;
    const user = users.find(u => u.email === email);
  
    if (user) {
      res.send({ body: { title: "Get user", data: user } });
    } else {
      res.status(404).send({ body: { title: "User not found" } });
    }
  };
  
  export const createUser = (req, res) => {
    const { email, name, password, gender, age, programme } = req.body;
  
    if (!email || !name || !password) {
      return res.status(400).send({ body: { title: "Email, name, and password are required." } });
    }
  
    const newUser = { email, name, password, gender, age, programme };
    users.push(newUser);
    res.status(201).send({ body: { title: "User created", data: newUser } });
  };
  
  export const updateUser = (req, res) => {
    const { email } = req.params;
    const { name, password, gender, age, programme } = req.body;
  
    const userIndex = users.findIndex(u => u.email === email);
  
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...(name && { name }),
        ...(password && { password }),
        ...(gender && { gender }),
        ...(age && { age }),
        ...(programme && { programme }),
      };
      res.send({ body: { title: "User updated", data: users[userIndex] } });
    } else {
      res.status(404).send({ body: { title: "User not found" } });
    }
  };
  
  export const deleteUser = (req, res) => {
    const { email } = req.params;
    const userIndex = users.findIndex(u => u.email === email);
  
    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1)[0];
      res.send({ body: { title: "User deleted", data: deletedUser } });
    } else {
      res.status(404).send({ body: { title: "User not found" } });
    }
  };