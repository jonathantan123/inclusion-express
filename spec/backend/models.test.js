const { Reservation } = require('../../models');


test("Reservation.all() should return an array", async () =>{
  const result = await Reservation.all() ||  [];
  expect(result.length).not.toBe(0)
});



test("Should be able to add a new reservation into the database", async () =>{
  let previous = await Reservation.all()

  await Reservation.create({
    name: 'Jon',
    slot: new Date(),
  });

  let exisiting = await Reservation.all()

  expect(exisiting.length).toBe(previous.length + 1)

});



