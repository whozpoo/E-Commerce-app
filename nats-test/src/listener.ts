import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { ItemCreatedListener } from './item-created-listener';

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

  new ItemCreatedListener(client).listen();
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
