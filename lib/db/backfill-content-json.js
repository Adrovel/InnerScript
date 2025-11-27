/**
 * Backfill script to populate content_json for existing notes that only have content.
 * 
 * This script converts plain text content into a TipTap-compatible JSON document
 * structure (a single paragraph node containing the text).
 * 
 * Usage: Run this script once after adding the content_json column to backfill
 * existing notes. Make sure to disable the sync with alter: true after running.
 * 
 * To run: node lib/db/backfill-content-json.js
 */

import { db } from './index.js'
import { readRecordsWithOptions, updateRecord } from './sequelize-query.js'

async function backfillContentJson() {
  try {
    console.log('Starting backfill of content_json for existing notes...')
    
    // Fetch all notes that have content but no content_json
    const notes = await readRecordsWithOptions(db.Notes, {
      where: {
        content: {
          [db.Sequelize.Op.ne]: null
        },
        content_json: null
      }
    })
    
    console.log(`Found ${notes.length} notes to backfill`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const note of notes) {
      try {
        // Convert plain text content to TipTap JSON structure
        // TipTap JSON format: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '...' }] }] }
        const contentJson = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: note.content ? [{ type: 'text', text: note.content }] : []
            }
          ]
        }
        
        const [affectedCount] = await updateRecord(db.Notes, { id: note.id }, { content_json: contentJson })
        if (affectedCount > 0) {
          successCount++
        } else {
          console.warn(`No rows affected for note ${note.id}`)
          errorCount++
        }
        
        if (successCount % 10 === 0) {
          console.log(`Processed ${successCount} notes...`)
        }
      } catch (err) {
        console.error(`Error processing note ${note.id}:`, err)
        errorCount++
      }
    }
    
    console.log(`\nBackfill complete!`)
    console.log(`Successfully processed: ${successCount} notes`)
    console.log(`Errors: ${errorCount} notes`)
    
    await db.sequelize.close()
  } catch (error) {
    console.error('Error during backfill:', error)
    await db.sequelize.close()
    process.exit(1)
  }
}

// Run the backfill
backfillContentJson()
