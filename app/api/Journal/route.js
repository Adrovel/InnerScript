import { Pool } from "pg";
const pool = new Pool({
  user: 'postgres',      // Database username
  host: 'localhost',     // Database host
  database: 'Innerscript',  // Database name
  password: 'newpassword',  // Database password
  port: 5432,           // PostgreSQL port
});

export async function GET(req) {
  try {
    // Fetch all journal entries
    const result = await pool.query('SELECT * FROM journal_entries');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Get the request body data
    const { title, content } = await req.json();

    // Insert a new journal entry into the database
    const result = await pool.query(
      'INSERT INTO journal_entries (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );

    // Respond with the newly created journal entry
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}