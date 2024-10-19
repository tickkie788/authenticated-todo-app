import express from "express";
import pg from "pg";
import env from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

env.config();

const app = express();
const port = process.env.PORT ?? 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to postgres
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Get all todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const todos = await db.query("SELECT * FROM todos WHERE user_email = $1", [
      userEmail,
    ]);
    res.json(todos.rows);
  } catch (error) {
    console.error(error);
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const id = uuidv4();
  const { user_email, title, progress, date } = req.body;
  try {
    const newTodo = await db.query(
      "INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)",
      [id, user_email, title, progress, date]
    );
    res.json(newTodo);
  } catch (error) {
    console.error(error);
  }
});

// Edit a todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editTodo = await db.query(
      "UPDATE todos SET user_email= $1, title = $2, progress = $3, date = $4 WHERE id = $5",
      [user_email, title, progress, date, id]
    );
    res.json(editTodo);
  } catch (error) {
    console.error(error);
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await db.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json(deleteTodo);
  } catch (error) {
    console.error(error);
  }
});

// Sign up
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Hashing password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    await db.query("INSERT INTO users VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    // create a JSON Web Token
    const token = jwt.sign({ email }, "secret", { expiresIn: "10m" });

    res.json({ email, token });
  } catch (error) {
    console.error(error);
    // Send an error detail to front-end
    res.json({ errorDetail: error.detail });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.json({ errorDetail: "User does not exist." });
    }

    // Compare password
    const comparePassword = await bcrypt.compare(
      password,
      user.rows[0].hashed_password
    );

    // create a JSON Web Token
    const token = jwt.sign({ email }, "secret", { expiresIn: "10m" }); 

    if (comparePassword) {
      res.json({ email, token });
    } else {
      return res.json({ errorDetail: "Incorrect password." });
    }
  } catch (error) {
    console.error(error);
    // Send an error detail to front-end
    res.json({ errorDetail: error.detail });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
