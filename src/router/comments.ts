import express from 'express';
import { fetchComment, showComment, deleteComment, createComment } from '../controllers/CommentController';

export default (router: express.Router) => {
    router.get('/comments', fetchComment)
    router.get('/comment/:id', showComment)
    router.delete('/comment/:id', deleteComment)
    router.post('/comment/create', createComment)
    
}