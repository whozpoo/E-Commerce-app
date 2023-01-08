import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@itemseller/commonlib';
import { body } from 'express-validator';
import { Item } from '../models/item';
import { Order, OrderStatus } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

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

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      item: {
        id: item.id,
        price: item.price,
      },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
