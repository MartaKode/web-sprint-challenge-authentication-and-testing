module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/auth.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './database/seeds' },
  },
  // adding testing environment :
testing: {
  client: "sqlite3",
  connection: {
    filename: "./datatabase/test.db3",
  },
  pool: {
    min: 2,
    max: 10
  },
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations',
    tableName: 'dbmigrations',
  },
  seeds: { directory: './database/seeds' },
},
};
