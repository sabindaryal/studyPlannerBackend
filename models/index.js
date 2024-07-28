const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const sequelize = new Sequelize(process.env.DATABASENAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    logging:false,
    dialect: 'mysql'
});
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize
db.UserSignup = require("./userSignup")(sequelize, DataTypes)
db.UserDevice = require("./userDevice")(sequelize, DataTypes)



db.Category= require("./category")(sequelize, DataTypes)
db.Task= require("./task")(sequelize, DataTypes)

// db.otp= require("./otpModel")(sequelize, DataTypes)

db.sequelize.sync({ force: false  });
module.exports = db; 