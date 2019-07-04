const Sequelize = require('sequelize');
const db 		= require('../database/db');

module.exports = db.sequelize.define(
	'interests',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		icon: {
			type: Sequelize.STRING	
		}
	},
	{
		timestamps: true
	}
);