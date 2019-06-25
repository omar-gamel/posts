import express from 'express';
import { body } from 'express-validator/check';

import feedController from '../controllers/feed';
import jwtAuth from '../services/passport';
import upload from '../services/multer';

const router = express.Router();

router.get('/posts', jwtAuth.authenticate(), feedController.getPosts);

router.post(
  '/post',
  jwtAuth.authenticate(),
  upload.single('imageUrl'),
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

router.get('/post/:postId', jwtAuth.authenticate(), feedController.getPost);

router.put(
  '/post/:postId',
  upload.single('imageUrl'),
  jwtAuth.authenticate(),
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

router.delete('/post/:postId', jwtAuth.authenticate(), feedController.deletePost);

module.exports = router;
