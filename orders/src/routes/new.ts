import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@itemseller/commonlib';
import { body } from 'express-validator';
import { Item } from '../models/item';
import { Order } from '../models/order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  body('itemId').not().isEmpty().withMessage('Empty Item ID'),
  body(''),
  validateRequest,
  async (req: Request, res: Response) => {
    // find the item the user is trying to order in the database
    const { itemId } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      throw new NotFoundError();
    }

    const isReserved = await item.isReserved();
    if (isReserved) {
      throw new BadRequestError('Item has been reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      item,
    });
    await order.save();

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
