const Sequelize = require("sequelize");
const db 		= require("../database/db");

module.exports = db.sequelize.define(
	'water_diaries',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: Sequelize.INTEGER
		},
		glass: {
			type: Sequelize.INTEGER
		}
	},
	{
		timestamps: true
	}
);
