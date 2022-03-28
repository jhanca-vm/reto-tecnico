const { Database } = require('sqlite3').verbose()

const database = new Database('./database/db.sqlite')

module.exports = database
