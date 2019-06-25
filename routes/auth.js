import express from 'express';
import { body } from 'express-validator/check';

import authController from '../controllers/auth';
import jwtAuth from '../services/passport';
import User from '../models/user';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
          if (user) {
            return Promise.reject('E-Mail address already exists!');
          }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', jwtAuth.authenticate(), authController.getUserStatus);

router.patch(
  '/status',
  jwtAuth.authenticate(),
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
);

export default router;
