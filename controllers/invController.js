const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// Build inventory by classificationId view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// Build single vehicle detail view
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const vehicleData = await invModel.getInventoryById(inv_id)

  // 404 if not found
  if (!vehicleData) {
    const err = new Error("Vehicle not found")
    err.status = 404
    throw err
  }

  const detailHTML = await utilities.buildVehicleDetail(vehicleData)
  const nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    detailHTML
  })
}

module.exports = invCont
