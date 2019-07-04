const Sequelize = require("sequelize");
const db 		= require("../database/db");

module.exports = db.sequelize.define(
	'feelings',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: Sequelize.INTEGER
		},
		emoji_no: {
			type: Sequelize.INTEGER
		}

	},
	{
		timestamps: true
	}
);
