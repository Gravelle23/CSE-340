const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}

baseController.triggerError = async (req, res, next) => {
  throw new Error("Intentional 500 error for testing")
}


module.exports = baseController
