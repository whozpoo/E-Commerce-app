import nats from 'node-nats-streaming';

console.clear();

const client = nats.connect('ecommerce', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Publisher connected');

  const data = JSON.stringify({
    id: '123',
    title: 'banana',
    price: '5',
  });

  client.publish('item:created', data, () => {
    console.log('event published');
  });
});
