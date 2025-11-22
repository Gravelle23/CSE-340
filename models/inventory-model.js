const pool = require("../database/")

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
  }
}

module.exports = { getClassifications, getInventoryByClassificationId }

// Get inventory item by inv_id
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

module.exports = {getClassifications, getInventoryByClassificationId,getInventoryById}
