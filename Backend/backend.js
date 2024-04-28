// dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(
  "<put your MongoDb url here>finance_app",
);
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtPassword = "Secret123456";

// database schema

const userDataSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const entry = new mongoose.Schema({
  username: String,
  expense: String,
  description: String,
  amount: String,
  // time: Time
});

const UserData = mongoose.model("UserData", userDataSchema);
const Entry = mongoose.model("Entry", entry);

// Input Validation Zod Schema
const ZodUserSchema = z.object({
  username: z.string(),
  password: z.string().min(6)
});

const ZodEntrySchema = z.object({
  username: z.string(),
  expense: z.string().max(50),
  description: z.string().max(200) ,
  amount : z.string().max(12)
});

// Middlewares

// this one checks for username avalability
async function checkUserExists(req, res, next) {
  const username = req.body.username;
  try {
    const existingUser = await UserData.findOne({ username});

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username already exists !! Try login" });
    } else {
      // Username is not available, proceed to the next middleware
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

// this one checks user is present in database or not if yess then let them access

async function userAccess(req, res, next) {
  const token = req.headers.token
  const decoded = jwt.verify(token, jwtPassword);
  const username = decoded.username;
  try {
    const existingUser = await UserData.findOne({ username});

    if (existingUser) {
      next()
    } else {
      res.json({message:"user does not have access"})
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

// this one checks for user legitimacy

async function login(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await UserData.findOne({ username, password });

    if (!user) {
      return res.status(403).json({ msg: "User doesn't exist" });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// this make sure user enter valid user info 

function userInputValidator(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const val = ZodUserSchema.safeParse({username , password})
  if (!val.success) {
    res.status(411).json({
      msg: "Invalid input",
    });
  } else {
    next();
  }
}

// this make sure user enter valid expence entry

function entryInputValidator (req ,res ,next){
  const username = req.body.username
  const expense = req.body.expense
  const description = req.body.description
  const amount = req.body.amount
  const validator = ZodEntrySchema.safeParse({username , expense , description , amount})
  if(!validator.success){
    res.status(411).json({
      msg : "invalid input"
      })
  }else{
    next();
  }
}

// this one parses body
app.use(express.json());

// routes

app.post("/signup", checkUserExists, userInputValidator ,async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    await UserData.create({ username, password });
    res.json({ message: "User Created Successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error creating user" }); // Send a more informative error response
  }
});

app.post("/login", login , (req, res) => {
  const username = req.body.username
    var token = jwt.sign({ username: username }, jwtPassword);
    return res.json({
      token,
    });
});

app.post("/entry", userAccess, entryInputValidator ,async (req, res) => {
  const token = req.headers.token
  const decoded = jwt.verify(token, jwtPassword);
  const username = decoded.username;
  const expense = req.body.expense;
  const description = req.body.description;
  const amount = req.body.amount;

  try {
    await Entry.create({ username, expense, description, amount });
    res.json({ message: "Entry successful" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error entring data" }); // Send a more informative error response
  }
});

app.get("/entries", userAccess, async (req, res) => {
  try {
    const token = req.headers.token
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    const all_entries = await Entry.find({username});
    res.json({ all_entries });
  } catch (err) {
    res.json({ msg: "some internam server error" });
  }
});

app.delete("/delete", userAccess, async (req, res) => {
  try {
    const token = req.headers.token
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;;
    const expense = req.body.expense;
    
    // Perform deletion using Mongoose
    const deletedEntry = await Entry.deleteOne({ username, expense });

    // Check if document was deleted (optional, for debugging/logging)
    // not mine logic
    if (!deletedEntry.deletedCount) {
      console.log("No matching entry found for deletion.");
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000);
