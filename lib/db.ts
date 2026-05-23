import mysql, { Pool } from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: Pool | undefined
}

export function getPool(): Pool {
  if (!global.__mysqlPool) {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      throw new Error('Please define DB_HOST, DB_USER, and DB_NAME in .env.local')
    }
    global.__mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    })
  }
  return global.__mysqlPool
}

export async function connectDB() {
  return getPool()
}

export default connectDB
