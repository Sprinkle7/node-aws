const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize("healthcoach","root","", {
	host: 'localhost',
	dialect: 'mysql',
	operaterAliases: false,

	pool:{
		max:5,
		min:0,
		acquire: 30000,
		idle: 10000
	}

});

db.sequelize = sequelize;

db.Sequelize = sequelize;

module.exports = db;
