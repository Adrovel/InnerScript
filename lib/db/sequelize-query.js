'use server'

/**
 * Inserts a new record into the specified Sequelize model.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {Object} data - The data to insert as a new record.
 * @returns {Promise<Object>} The created record as a plain object.
 */
async function createRecord(table, data) {
  // Create a new record
  const result = await table.create(data)
  return result.toJSON()
}

async function readAllRecords(table, include = [], order = []) {
  const results = await table.findAll({ include, order })
  return results.map(record => record.toJSON())
}

/**
 * Retrieves a record from the specified Sequelize model by its primary key.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {number|string} pk - The primary key value of the record to retrieve.
 * @returns {Promise<Object|null>} The found record as a plain object, or null if not found.
 */
async function readUsingPK(table, pk) {
  const result = await table.findByPk(pk)
  return result ? result.toJSON() : null
}

/**
 * Updates records in the specified Sequelize model matching the given condition.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {Object} condition - The condition used to select records for updating (Sequelize 'where' clause).
 * @param {Object} data - The data to update in the selected records.
 * @returns {Promise<number>} The number of affected rows.
 */
async function updateRecord(table, condition, data) {
  const affectedCount = await table.update(
    data,
    { where: condition }
  )
  return affectedCount
}

/**
 * Deletes records from the specified Sequelize model matching the given condition.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {Object} condition - The condition used to select records for deletion (Sequelize 'where' clause).
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteRecord(table, condition) {
  const affectedRows = await table.destroy({
    where: condition,
    truncate: false
  })
  return affectedRows
}

export { 
  createRecord, 
  readUsingPK, 
  updateRecord, 
  deleteRecord,
  readAllRecords
}