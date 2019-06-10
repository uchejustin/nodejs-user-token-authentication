'use strict';

// require the node packages
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// set a reference to this file's name so it can be excluded later
const basename = path.basename(__filename);

// create a variable called env which will pull from the process.env
// or default to 'development' if nothing is specified
const env = process.env.NODE_ENV || 'development';

// require the config file that was generated by sequelize and use the
// env variable just created to pull in the correct db creds
const config = require(__dirname + '/../config/config.json')[env];

// initalize a db object
const db = {};

let sequelize;
// an optional property can be set on the config objects call 'use_env_variable' if desired 
// to set db credentials on the process.env. (for remote server in production settings)
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // otherwise the config object is used to initialize the sequelize instance
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// This puts all model files onto our db object, so they can be used in the rest of application
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// export the main sequelize package with an uppercase 'S' and 
// application's sequelize instance with a lowercase 's'
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;