import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

function generateToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user._id.toString()),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.status(200).json({
    message: "Login successful",
    token: generateToken(user._id.toString()),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};