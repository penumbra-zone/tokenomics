import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
import { env } from '@/lib/env'

/**
 * Singleton PostgreSQL connection pool.
 * Uses DATABASE_URL from environment variables.
 *
 * Usage:
 *   import { query } from '@/lib/db'
 *   const { rows } = await query('SELECT * FROM my_table')
 */
const connectionString = env.DATABASE_URL

const poolConfig = {
  connectionString,
  ssl: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : false,
};

let pool: Pool

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig)
} else {
  // Ensure the pool is not recreated in development with hot reloads
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool(poolConfig)
  }
  pool = (global as any).pgPool
}

/**
 * Run a SQL query on the PostgreSQL database.
 * @param text - SQL query string
 * @param params - Optional query parameters
 * @returns QueryResult<T>
 */
export const query = async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params)
} 