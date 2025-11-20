const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {

      let thumb = vehicle.inv_thumbnail || ""

      // Normalize slashes
      thumb = thumb.replace(/\\/g, "/")

      // Remove ANY repeated "images/" or "vehicles/" prefixes
      thumb = thumb.replace(/(images\/vehicles\/)+/g, "images/vehicles/")

      // Now remove any leading ./ or ../
      thumb = thumb.replace(/^(\.\/|\.\.\/)+/, "")

      // Ensure we only have the filename at the end
      const fileName = thumb.split("/").pop()

      // Build the correct ABSOLUTE path
      thumb = "/images/vehicles/" + fileName

      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${thumb}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" 
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}




module.exports = Util
