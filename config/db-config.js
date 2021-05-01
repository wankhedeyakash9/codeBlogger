//databae configuration
module.exports = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dateStrings: true,
  acquireTimeout: 1000000,
};
