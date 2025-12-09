const pool = require("../database/")

// Get all classifications (for nav, select lists, etc.)
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

// Get inventory by classification id
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    throw error
  }
}

// Get single inventory item by inv_id
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
    throw error
  }
}

// get all inventory items with classification names
async function getAllInventory() {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      ORDER BY i.inv_make, i.inv_model, i.inv_year
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllInventory error " + error)
    throw error
  }
}

// get comparable vehicles based on classification and price
async function getComparableVehicles(inv_id) {
  try {
    const sql = `
      SELECT i2.*, c.classification_name
      FROM public.inventory AS i2
      JOIN public.inventory AS base
        ON base.classification_id = i2.classification_id
      JOIN public.classification AS c
        ON i2.classification_id = c.classification_id
      WHERE base.inv_id = $1
        AND i2.inv_id <> $1
      ORDER BY ABS(i2.inv_price - base.inv_price)
      LIMIT 3
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getComparableVehicles error " + error)
    throw error
  }
}

// Insert a new classification
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING classification_id, classification_name
    `
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error " + error)
    throw error
  }
}

// Insert a new inventory item
async function addInventory(vehicleData) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING inv_id
    `
    const data = await pool.query(sql, [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error " + error)
    throw error
  }
}

// Update an existing inventory item
async function updateInventory(vehicleData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *
    `
    const data = await pool.query(sql, [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id,
      vehicleData.inv_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updateInventory error " + error)
    throw error
  }
}

// Delete an inventory item by id
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rowCount
  } catch (error) {
    console.error("deleteInventory error " + error)
    throw error
  }
}

module.exports = {getClassifications,getInventoryByClassificationId,getInventoryById,getAllInventory,addInventory,updateInventory,deleteInventory,getComparableVehicles,addClassification}
