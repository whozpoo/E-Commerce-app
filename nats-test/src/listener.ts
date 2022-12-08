import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const client = nats.connect('ecommerce', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected');

  client.on('closed', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('item-service');
  const subscription = client.subscribe(
    'item:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    console.log(`message #${msg.getSequence()} received`);
    msg.ack();
  });
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
