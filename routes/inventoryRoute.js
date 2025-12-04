const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const auth = require("../utilities/auth")

// Inventory Management view 
router.get("/",auth.checkJWTToken,auth.checkAdmin,utilities.handleErrors(invController.buildManagementView))

// add Classification form 
router.get("/add-classification",auth.checkJWTToken,auth.checkAdmin,utilities.handleErrors(invController.buildAddClassification))

// process Add Classification 
router.post("/add-classification",auth.checkJWTToken,auth.checkAdmin,invValidate.classificationRules(),invValidate.checkClassificationData,utilities.handleErrors(invController.addClassification))

// add Inventory form 
router.get("/add-inventory",auth.checkJWTToken,auth.checkAdmin,utilities.handleErrors(invController.buildAddInventory))

// process Add Inventory 
router.post("/add-inventory",auth.checkJWTToken,auth.checkAdmin,invValidate.inventoryRules(),invValidate.checkInventoryData,utilities.handleErrors(invController.addInventory))

// Process Inventory update
router.post("/update",invValidate.inventoryRules(),invValidate.checkUpdateData,utilities.handleErrors(invController.updateInventory))

// Build edit inventory view
router.get("/edit/:inv_id",utilities.handleErrors(invController.editInventoryView))

// Return inventory by classification as JSON
router.get("/getInventory/:classification_id",utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory by classification view 
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId))

// single vehicle detail view 
router.get("/detail/:inv_id",utilities.handleErrors(invController.buildDetailView))

// Trigger error for testing
router.get("/trigger-error",utilities.handleErrors(baseController.triggerError))

// Build delete confirmation view
router.get("/delete/:inv_id",utilities.handleErrors(invController.buildDeleteInventory))

// Process delete form
router.post("/delete",utilities.handleErrors(invController.deleteInventory))

module.exports = router
