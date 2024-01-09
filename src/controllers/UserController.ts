import prisma from "../../config/db.config";
import express from "express";
import bcrypt from "bcrypt";

export const fetchUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await prisma.user.findMany({
        include: {
            post: {
                select:{
                    title: true,
                    comment_count: true
                },
                
            }
        }
    });

    return res.json({ status: 200, data: users });
  } catch (error) {
    console.error("Error fetchUsers:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const showUser = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.json({ status: 404, message: "User Not Found" });
    }

    return res.json({ status: 200, message: `Hello ${user.name}`, data: user });
  } catch (error) {
    console.error("Error showUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.sendStatus(400);
    }

    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (findUser) {
      return res.json({
        status: 400,
        message: "Email Already Taken, Please choose another email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return res.json({ status: 200, data: newUser, message: "User created" });
  } catch (error) {
    console.error("Error createUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const userId: number = Number(req.params.id);
  const { name, email, password } = req.body;
  console.log("Received data:", name, email, password);
  console.log("Received userId:", userId);
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    return res.json({ status: 201, data: updateUser, message: "User Update" });
  } catch (error) {
    console.error("Error updateUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deleteOne = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("req.params.id", req.params.id);
  try {
    const userId: number = Number(req.params.id);
    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    return res.json({ status: 201, message: `User ${user.name} delete` });
  } catch (error) {
    console.error("Error deleteUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
