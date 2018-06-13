/**
 * Module registering sequelize, making database connections, and registering any models
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const basename = path.basename(module.filename);
const db = {};
// set up connection
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.db.logging,
  },
);

// read all models form this directory and register them with sequelize instance
fs
  .readdirSync(`${__dirname}/models`)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, 'models', file));
    db[model.name] = model;
  });

// register any relational associations between models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// expose sequelize instance and class itself to access constants and other statics
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
