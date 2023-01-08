import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
} from '@itemseller/commonlib';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {}
