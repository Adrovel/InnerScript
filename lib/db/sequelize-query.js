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

/**
 * Retrieves all records with custom attributes and ordering options.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {Object} options - Query options.
 * @param {Array<string>} [options.attributes] - Array of attribute names to select.
 * @param {Array} [options.order] - Order clause for sorting results.
 * @param {Array} [options.include] - Include associations.
 * @returns {Promise<Array<Object>>} Array of records as plain objects.
 */
async function readRecordsWithOptions(table, options = {}) {
  const results = await table.findAll(options)
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
 * Updates a record and returns the updated record as a plain object.
 *
 * @async
 * @param {import('sequelize').Model} table - The Sequelize model representing the table.
 * @param {Object} condition - The condition used to select records for updating (Sequelize 'where' clause).
 * @param {Object} data - The data to update in the selected records.
 * @returns {Promise<Object|null>} The updated record as a plain object, or null if not found.
 */
async function updateAndFetchRecord(table, condition, data) {
  const [affectedCount] = await table.update(
    data,
    { where: condition, returning: true }
  )
  
  if (affectedCount === 0) {
    return null
  }
  
  const updatedRecord = await table.findOne({ where: condition })
  return updatedRecord ? updatedRecord.toJSON() : null
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
  updateAndFetchRecord,
  deleteRecord,
  readRecordsWithOptions
}