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
    inv_id: vehicleData.inv_id,          
    vehicleData                         
  })

}

// Inventory Management view 
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
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

// Get Inventory JSON by classificationId
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData && invData[0] && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Edit Inventory view
invCont.editInventoryView = async function (req, res, next) {
  // get the inv_id from the url
  const inv_id = parseInt(req.params.inv_id)

  // navigation bar
  let nav = await utilities.getNav()

  // vehicle data from the model
  const itemData = await invModel.getInventoryById(inv_id)

  // build classification select list
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  )

  // vehicle name for the title
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  // render the edit-inventory view
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

// Update Inventory data
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const updatedVehicle = {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  }

  try {
    const updateResult = await invModel.updateInventory(updatedVehicle)

    if (updateResult) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} was successfully updated.`
      )
      return res.redirect("/inv/")
    } else {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(
        classification_id
      )

      req.flash("notice", "Sorry, the update failed.")
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + inv_make + " " + inv_model,
        nav,
        classificationList,
        errors: null,
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
    }
  } catch (error) {
    next(error)
  }
}

// Build delete confirmation view
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  if (!itemData) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/")
  }

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
  })
}

// Delete inventory item
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const itemName = `${req.body.inv_make} ${req.body.inv_model}`
  let nav = await utilities.getNav()

  try {
    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
      req.flash("notice", `The ${itemName} was successfully deleted.`)
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.status(500).render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        ...req.body,
      })
    }
  } catch (error) {
    next(error)
  }
}

// Build vehicle comparison view
invCont.buildCompareView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const allVehicles = await invModel.getAllInventory()

    const firstId = req.query.first ? parseInt(req.query.first) : null
    const secondId = req.query.second ? parseInt(req.query.second) : null

    let firstVehicle = null
    let secondVehicle = null
    let comparableVehicles = []
    let pageTitle = "Compare Vehicles"

    // if both vehicle ids are provided, get their data
    if (firstId && secondId) {
      // different vehicles selected
      if (firstId === secondId) {
        req.flash(
          "notice",
          "Please choose two different vehicles to compare."
        )
        return res.status(400).render("inventory/compare", {
          title: pageTitle,
          nav,
          errors: null,
          allVehicles,
          firstVehicle: null,
          secondVehicle: null,
          comparableVehicles: [],
          firstId,
          secondId,
        })
      }

      firstVehicle = await invModel.getInventoryById(firstId)
      secondVehicle = await invModel.getInventoryById(secondId)

      if (!firstVehicle || !secondVehicle) {
        req.flash("notice", "One or both vehicles could not be found.")
        return res.status(404).render("inventory/compare", {
          title: pageTitle,
          nav,
          errors: null,
          allVehicles,
          firstVehicle: null,
          secondVehicle: null,
          comparableVehicles: [],
          firstId,
          secondId,
        })
      }

      comparableVehicles = await invModel.getComparableVehicles(firstId)

      pageTitle = `Compare ${firstVehicle.inv_year} ${firstVehicle.inv_make} ${firstVehicle.inv_model} vs ${secondVehicle.inv_year} ${secondVehicle.inv_make} ${secondVehicle.inv_model}`
    }

    return res.render("inventory/compare", {
      title: pageTitle,
      nav,
      errors: null,
      allVehicles,
      firstVehicle,
      secondVehicle,
      comparableVehicles,
      firstId,
      secondId,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
