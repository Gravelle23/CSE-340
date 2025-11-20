const { Pool } = require("pg")
require("dotenv").config()

let pool

if (process.env.NODE_ENV == "development") {
  // SSL and log queries
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // troubleshooting queries 
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  // no SSL or query logging
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  module.exports = pool
}
