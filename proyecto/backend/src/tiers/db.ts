import sql from 'mssql';

const useSqlAuth = (process.env.SQL_AUTH || '').toLowerCase() === 'sql';

// Config base compatible con driver 'tedious'. Para SQL Auth se pasan credenciales.
const config: sql.config = {
  server: process.env.SQL_SERVER || 'SARFERT',
  database: process.env.SQL_DATABASE || 'univ_docs',
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true,
    instanceName: '' // Vacío para instancia por defecto
  },
  port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 1433,
  ...(useSqlAuth
    ? { 
        user: process.env.SQL_USER || 'sa', 
        password: process.env.SQL_PASSWORD || ''
      }
    : {
        // Windows Authentication (usa las credenciales del usuario actual de Windows)
        authentication: {
          type: 'default'
        }
      })
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  pool = await sql.connect(config);
  return pool;
}

export { sql };


