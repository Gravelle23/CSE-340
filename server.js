/******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")

const app = express()
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

const session = require("express-session")
const pool = require("./database/")
const flash = require("connect-flash")
const messages = require("express-messages")
const accountRoute = require("./routes/accountRoute")


/* ***********************
 * View Engine and Views Folder Setup
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Session Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

/* ***********************
 * Flash Message Middleware
 *************************/
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res)
  next()
})


/* ***********************
 * Middleware and Routes
 *************************/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public"))) 
app.use(staticRoutes)

// Index route using the baseController
app.get("/", baseController.buildHome)

// Inventory route
app.use("/inv", inventoryRoute)

// Account route
app.use("/account", accountRoute)

/* ***********************
 * Error Handler Middleware
 *************************/
const utilities = require("./utilities/")

app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  // Default to 500 if no status set
  const status = err.status || 500

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 Not Found" : "Server Error",
    nav,
    message: err.message,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
