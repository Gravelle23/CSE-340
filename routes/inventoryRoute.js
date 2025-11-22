const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView))
router.get("/trigger-error", utilities.handleErrors(baseController.triggerError))


module.exports = router
