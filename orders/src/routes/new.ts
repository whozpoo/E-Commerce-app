import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@itemseller/commonlib';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  body('itemId').not().isEmpty().withMessage('Empty Item ID'),
  body(''),
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
