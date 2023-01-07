import { Item } from '../item';

it('implements optimistic concurrency control', async () => {
  const item = Item.build({
    title: 'bread',
    price: 1,
    userId: '123',
  });
  await item.save();

  const first = await Item.findById(item.id);
  const second = await Item.findById(item.id);

  first!.set({ price: 2 });
  second!.set({ price: 3 });

  await first!.save();
  try {
    await second!.save();
  } catch {
    return;
  }

  throw new Error('The second should not get processed');
});

it('increments the version number on multiple saves', async () => {
  const item = Item.build({
    title: 'bread',
    price: 1,
    userId: '123',
  });
  await item.save();
  expect(item.version).toEqual(0);
  await item.save();
  expect(item.version).toEqual(1);
  await item.save();
  expect(item.version).toEqual(2);
});
