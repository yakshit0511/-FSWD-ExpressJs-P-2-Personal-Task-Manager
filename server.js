const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");

app.use(express.json()); // it is collect you data from the buffer and convert it to json object

// connect to mongodb
mongoose
.connect("mongodb://127.0.0.1:27017/user-profile")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("Failed to connect to MongoDB", err);
});

// schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
});

// model
const User = mongoose.model("user", userSchema);

app
  .get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });{}
  res.json(user);
});

app.post("/users", async (req, res) => {
  
  const body = req.body;
  users.push({...body});
  
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err, data) => {
    return res.status(202).json({ message: "Product was Added." });
  });

  const result=await User.create({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });

  return res.status(201).json({ message: "User was created", user: result });
});

const getUsers = () => {
  const data = fs.readFileSync("MOCK_DATA.json");
  return JSON.parse(data);
};
const saveUsers = (users) => {
  fs.writeFileSync("data.json", JSON.stringify(users, null, 2));
};

app.patch("/users/:id", (req, res) => {
  const users = getUsers();
  const userId = parseInt(req.params.id);
  const { id, product_name, price, category, brand, stock_quantity, task_status } = req.body;

  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
  }

  if (id) users[userIndex].id = id;
  if (task_name) users[userIndex].task_name =task_name;
  if (due_date) users[userIndex].due_date = dup_date;
  if (priority) users[userIndex].priority = priority;
  if (task_status) users[userIndex].task_statusstatus = task_status;

  saveUsers(users);
  res.json({ message: "User updated successfully", user: users[userIndex] });
});



app.delete("/users/:id", (req, res) => {
  const users = getUsers();
  const userId = parseInt(req.params.id);

  const newUsers = users.filter(user => user.id !== userId);

  if (users.length === newUsers.length) {
      return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});