const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// Inventory by classification view 
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  // If there are vehicles, use the classification_name from the first row
  let className = "Vehicles"

  if (data && data.length > 0) {
    className = data[0].classification_name
  } else {
    // If there are no vehicles yet, still get the classification name
    const allClasses = await invModel.getClassifications()
    const row = allClasses.rows.find(
      (r) => r.classification_id == classification_id
    )
    if (row) {
      className = row.classification_name
    }
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// single vehicle detail view
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
    detailHTML,
  })
}

// Inventory Management view 
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

// Add Classification view 
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  })
}

// Process Add Classification 
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", "Classification added successfully.")
      const nav = await utilities.getNav()
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      const nav = await utilities.getNav()
      return res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (err) {
    next(err)
  }
}

// Add Inventory view 
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  })
}


// Process Add Inventory 

invCont.addInventory = async function (req, res, next) {
  const vehicleData = { ...req.body }

  try {
    const result = await invModel.addInventory(vehicleData)

    if (result) {
      req.flash("notice", "New vehicle added successfully.")
      const nav = await utilities.getNav()
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(
        vehicleData.classification_id
      )

      return res.status(500).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        ...vehicleData,
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = invCont
