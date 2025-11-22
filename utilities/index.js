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

Util.handleErrors = (fn) => {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}

Util.buildVehicleDetail = async function (v) {
  let fullImage = v.inv_image || ""
  fullImage = fullImage.replace(/\\/g, "/")
  fullImage = fullImage.replace(/^(\.\/|\.\.\/)+/, "")

  const fileName = fullImage.split("/").pop()
  fullImage = "/images/vehicles/" + fileName

  return `
<section class="vehicle-detail">
  <div class="vehicle-detail__image">
    <img src="${fullImage}" alt="Image of ${v.inv_make} ${v.inv_model}">
  </div>

  <div class="vehicle-detail__content">
    <h2>${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>

    <p class="price"><strong>Price:</strong>
      ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v.inv_price)}
    </p>

    <p class="miles"><strong>Mileage:</strong>
      ${new Intl.NumberFormat("en-US").format(v.inv_miles)} miles
    </p>

    <p><strong>Description:</strong> ${v.inv_description}</p>
    <p><strong>Color:</strong> ${v.inv_color}</p>
    <p><strong>Classification:</strong> ${v.classification_name}</p>
  </div>
</section>
`
}



module.exports = Util
