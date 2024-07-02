import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const authRouter = Router();
const collection = db.collection("users");

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้

authRouter.post("/register", async (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstName,
    lastname: req.body.lastName,
  };

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const collection = db.collection("users")
  await collection.insertOne(newUser);

  return res.json({
    message: "User has been created successfully",
  });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้

authRouter.post("/login", async (req, res) => {
  const user = await collection.findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );

  return res.json({
    message: "login successfully",
    token,
  });
});

export default authRouter;