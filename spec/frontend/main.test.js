
require("../../public/js/main");
const { Reservation } = require('../../models');

const fs = require("fs");
const path = require("path");
const js = fs.readFileSync(path.resolve(__dirname, '../../public/js/utils.js'), "utf8");

eval(js)


test("should return an object with 17 time slots", () => {

let array = [{id: 1, name: "John Cena", slot: "2/21/2020, 5:00:00 PM", createdAt: "2020-02-13T17:59:20.436Z", updatedAt: "2020-02-13T17:59:20.436Z"}]
let result = getAvail(array)
  expect(Object.keys(result).length).toBe(17)

});


