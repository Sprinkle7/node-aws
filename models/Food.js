const Sequelize = require("sequelize");
const db 		= require("../database/db");

module.exports = db.sequelize.define(
	'food_diaries',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: Sequelize.INTEGER
		},
		food_type: {
			type: Sequelize.STRING
		},
		image:{
			type: Sequelize.STRING
		}

	},
	{
		timestamps: true
	}
);
