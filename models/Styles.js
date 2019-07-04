const Sequelize = require('sequelize');
const db 		= require('../database/db');

module.exports = db.sequelize.define(
	'preferred_styles',
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