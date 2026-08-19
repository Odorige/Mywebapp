const { Pool } = require('pg');

// ============================================================
// PostgreSQL CONNECTION POOL
// ============================================================
//
// Local Docker:
//   PGHOST=postgres
//   PGPORT=5432
//   PGUSER=clipwave
//   PGPASSWORD=clipwave_pw
//   PGDATABASE=clipwave
//   PGSSL=false
//
// Azure PostgreSQL:
//   PGHOST=<azure-postgres-host>
//   PGPORT=5432
//   PGUSER=clipwave
//   PGPASSWORD=<azure-password>
//   PGDATABASE=clipwave
//   PGSSL=true
//
// Database configuration is supplied through environment
// variables so no environment-specific credentials are
// hard-coded into the application.
//
// ============================================================

const pool = new Pool({

  // ----------------------------------------------------------
  // Database host
  // ----------------------------------------------------------
  //
  // Local Docker:
  //   PGHOST=postgres
  //
  // Azure:
  //   PGHOST=<your-server>.postgres.database.azure.com
  //
  // ----------------------------------------------------------

  host:
    process.env.PGHOST || 'postgres',

  // ----------------------------------------------------------
  // PostgreSQL port
  // ----------------------------------------------------------

  port:
    parseInt(
      process.env.PGPORT || '5432',
      10
    ),

  // ----------------------------------------------------------
  // Database username
  // ----------------------------------------------------------

  user:
    process.env.PGUSER || 'clipwave',

  // ----------------------------------------------------------
  // Database password
  // ----------------------------------------------------------
  //
  // IMPORTANT:
  // The real password should be supplied through an
  // environment variable / Azure secret.
  //
  // ----------------------------------------------------------

  password:
    process.env.PGPASSWORD || 'clipwave_pw',

  // ----------------------------------------------------------
  // Database name
  // ----------------------------------------------------------

  database:
    process.env.PGDATABASE || 'clipwave',

  // ----------------------------------------------------------
  // SSL
  // ----------------------------------------------------------
  //
  // Local Docker:
  //   PGSSL=false
  //
  // Azure PostgreSQL:
  //   PGSSL=true
  //
  // Azure requires encrypted PostgreSQL connections.
  //
  // ----------------------------------------------------------

  ssl:
    process.env.PGSSL === 'true'
      ? {
          rejectUnauthorized: false
        }
      : undefined,

  // ----------------------------------------------------------
  // Connection pool
  // ----------------------------------------------------------
  //
  // Reuses database connections instead of creating a new
  // connection for every HTTP request.
  //
  // This is important when the backend is horizontally scaled.
  //
  // ----------------------------------------------------------

  max:
    parseInt(
      process.env.PG_POOL_MAX || '20',
      10
    ),

  idleTimeoutMillis:
    parseInt(
      process.env.PG_IDLE_TIMEOUT || '30000',
      10
    ),

  connectionTimeoutMillis:
    parseInt(
      process.env.PG_CONNECTION_TIMEOUT || '10000',
      10
    )
});


// ============================================================
// POOL ERROR HANDLER
// ============================================================

pool.on('error', (err) => {

  console.error(
    '[postgres] unexpected error on idle client:',
    err.message
  );

});


// ============================================================
// EXPORT CONNECTION POOL
// ============================================================

module.exports = pool;