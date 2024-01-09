import prisma from "../../config/db.config";
import express from "express";

export const fetchPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      where: {
        NOT: {
          title: {
            endsWith: "Blog",
          },
        },
      },
    });

    //   * to get the total posts count
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.json({ status: 200, data: posts, 
        meta:{ totalPages, currentPage: page, limit :limit} 
    });
  } catch (error) {
    console.error("Error fetchPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const showPost = async (req: express.Request, res: express.Response) => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return res.json({ status: 404, message: "Post Not Found" });
    }

    return res.json({
      status: 200,
      message: `Hello ${post.title}`,
      data: post,
    });
  } catch (error) {
    console.error("Error showUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user_id, title, description } = req.body;
    if (!user_id || !title || !description) {
      return res.sendStatus(400);
    }

    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title: title,
        description: description,
      },
    });

    return res.json({ status: 200, data: newPost, message: "Post created" });
  } catch (error) {
    console.error("Error createPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const updatePost = async (
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
    return res.json({ status: 201, data: updateUser, message: "Post Update" });
  } catch (error) {
    console.error("Error updatePost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deletePost = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("req.params.id", req.params.id);
  try {
    const postId: number = Number(req.params.id);
    const post = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return res.json({ status: 201, message: `Post "${post.title}" delete` });
  } catch (error) {
    console.error("Error deletePost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
