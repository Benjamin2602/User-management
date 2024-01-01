const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
//parsing the request body as JSON format
app.use(express.json());

//cors middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// test api endpoint that is not connected to the db
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "API is Working bro" });
  } catch (error) {
    res.status(500).json({ message: "API is not working bro" });
  }
});

//get all the users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
});

//get a single user
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user" });
  }
});

//create a new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

//update a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
