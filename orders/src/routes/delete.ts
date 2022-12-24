import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@itemseller/commonlib';

import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an event saying this was cancelled!

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
