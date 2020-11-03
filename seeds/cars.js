
exports.seed = async function(knex) {
await knex("cars").truncate();

await knex("cars").insert([
  {vin: "1234123412341234", make: "chevy", model: "wowcar", mileage: 345, transmissionType: "auto"}
])
};
