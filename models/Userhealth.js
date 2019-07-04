const Sequelize = require("sequelize");
const db 		= require("../database/db");

module.exports = db.sequelize.define(
	'user_health',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		weight: {
			type: Sequelize.STRING
		},
		bmi: {
			type: Sequelize.STRING
		},
		muscle: {
			type: Sequelize.STRING
		},
		water: {
			type: Sequelize.STRING
		},
		bmr: {
			type: Sequelize.STRING
		},
		metabolic: {
			type: Sequelize.STRING
		},
		bone: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		fat: {
			type: Sequelize.STRING
		}
	},
	{
		timestamps: true
	}
);