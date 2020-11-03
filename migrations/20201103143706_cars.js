
exports.up = async function(knex) {
    await knex.schema.createTable("cars", (table) => {
        table.integer("vin").notNull().unique().primary()
        table.text("make").notNull()
        table.text("model").notNull()
        table.float("mileage").notNull()
        table.text("transmissionType").default(null)
        table.text("titleStatus").default(null)
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("cars")
};
