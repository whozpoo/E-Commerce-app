import nats from 'node-nats-streaming';
import { ItemCreatedPublisher } from '../../commonlib/src/events/item-created-publisher';

console.clear();

const client = nats.connect('ecommerce', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', async () => {
  console.log('Publisher connected');

  const data = {
    id: '123',
    title: 'banana',
    price: 5,
  };

  const publisher = new ItemCreatedPublisher(client);
  try {
    await publisher.publish(data);
  } catch (err) {
    console.error(err);
  }
});
