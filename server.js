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
const app = express()
const staticRoutes = require("./routes/static")

/* ***********************
 * View Engine and Views Folder Setup
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Middleware and Routes
 *************************/
app.use(express.static(path.join(__dirname, "public"))) // optional, for static files
app.use(staticRoutes)

// Index route
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
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
