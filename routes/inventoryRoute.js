const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Inventory Management view
router.get("/",utilities.handleErrors(invController.buildManagementView))
// Add Classification form (GET)
router.get("/add-classification",utilities.handleErrors(invController.buildAddClassification))
// Process Add Classification (POST)
router.post("/add-classification",invValidate.classificationRules(),invValidate.checkClassificationData,utilities.handleErrors(invController.addClassification))
// Add Inventory form 
router.get("/add-inventory",utilities.handleErrors(invController.buildAddInventory))
// Process Add Inventory (
router.post("/add-inventory",invValidate.inventoryRules(),invValidate.checkInventoryData,utilities.handleErrors(invController.addInventory))
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id",utilities.handleErrors(invController.buildDetailView))
router.get("/trigger-error",utilities.handleErrors(baseController.triggerError))

module.exports = router
