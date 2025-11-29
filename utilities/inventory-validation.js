const utilities = require(".")
const { body, validationResult } = require("express-validator")

const invValidate = {}

// classification validation rules
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage(
        "Classification name may not contain spaces or special characters."
      ),
  ]
}

// check classification data
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
    })
    return
  }
  next()
}

// inventory validation rules
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification.")
      .isInt({ min: 1 })
      .withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900 })
      .withMessage("Year must be a valid number."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ]
}

// inventory data validation
invValidate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  const {
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

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
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
    return
  }
  next()
}

module.exports = invValidate
