import prisma from "../../config/db.config";
import express from "express";

export const fetchComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const comments = await prisma.comment.findMany({});

    return res.json({ status: 200, data: comments });
  } catch (error) {
    console.error("Error fetchComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const showComment = async (req: express.Request, res: express.Response) => {
  try {
    const commentId = req.params.id;

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.json({ status: 404, message: "Commment Not Found" });
    }

    return res.json({
      status: 200,
      message: `Hello ${comment.comment}`,
      data: comment,
    });
  } catch (error) {
    console.error("Error showComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user_id, post_id, comment } = req.body;
    if (!user_id || !post_id || !comment) {
      return res.sendStatus(400);
    }

    await prisma.post.update({
        where: {
            id: Number(post_id)
        },
        data:{
            comment_count:{
              increment:1  
            }
        }
    })

    const newComment = await prisma.comment.create({
      data: {
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment: comment,
      },
    });

    return res.json({ status: 200, data: newComment, message: "createComment created" });
  } catch (error) {
    console.error("Error createComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};


export const deleteComment = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("req.params.id", req.params.id);
  try {
    const commentId = req.params.id;

    await prisma.post.update({
        where: {
            id: Number(commentId)
        },
        data:{
            comment_count:{
              decrement:1  
            }
        }
    })


    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res.json({ status: 201, message: `The comment "${comment.comment}" delete` });
  } catch (error) {
    console.error("Error deleteComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
