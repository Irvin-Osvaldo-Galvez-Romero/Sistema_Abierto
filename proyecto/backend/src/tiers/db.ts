import sql from 'mssql';

const config: sql.config = {
  server: process.env.SQL_SERVER || 'SARFERT',
  database: process.env.SQL_DATABASE || 'univ_docs',
  options: {
    trustServerCertificate: true,
    encrypt: false
  },
  authentication: {
    type: process.env.SQL_AUTH === 'sql' ? 'default' : 'ntlm',
    options:
      process.env.SQL_AUTH === 'sql'
        ? { userName: process.env.SQL_USER || 'sa', password: process.env.SQL_PASSWORD || '' }
        : { domain: process.env.SQL_DOMAIN || undefined, userName: process.env.SQL_WINUSER || undefined, password: process.env.SQL_WINPASS || undefined }
  },
  port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 1433
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  pool = await sql.connect(config);
  return pool;
}

export { sql };


