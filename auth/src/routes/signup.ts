import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log('Creating a user...');

    res.send({});
  }
);

export { router as signupRouter };
