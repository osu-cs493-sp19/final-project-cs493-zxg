/*
 *
 */

const mysql = require('mysql');
// const { createPool } = require('mysql');

const mysqlHost = process.env.MYSQL_HOST || 'localhost';
const mysqlPort = process.env.MYSQL_PORT || 3306;
const mysqlDBName = process.env.MYSQL_DB_NAME || 'bookaplace';
const mysqlUser = process.env.MYSQL_USER || 'bookaplace';
const mysqlPassword = process.env.MYSQL_PASSWORD || 1111;

const mysqlPool = mysql.createPool({
  connectionLimit: 100,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDBName,
  user: mysqlUser,
  password: mysqlPassword
});

module.exports = mysqlPool;
