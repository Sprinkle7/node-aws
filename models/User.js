const Sequelize = require("sequelize");
const db 		= require("../database/db");

module.exports = db.sequelize.define(
	'users',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: Sequelize.STRING
		},
		last_name: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		created: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		goal: {
			type: Sequelize.STRING
		},
		date_of_birth: {
			type: Sequelize.STRING
		},
		terms_acceptance: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		target_weight: {
			type: Sequelize.STRING
		},
		target_description: {
			type: Sequelize.STRING
		},
		relation_status: {
			type: Sequelize.STRING
		},
		no_childs: {
			type: Sequelize.STRING
		},
		occupation: {
			type: Sequelize.STRING
		},
		hours_per_week: {
			type: Sequelize.STRING
		},
		nationality: {
			type: Sequelize.STRING
		},
		current_living: {
			type: Sequelize.STRING
		},
		height: {
			type: Sequelize.STRING
		},
		weight: {
			type: Sequelize.STRING
		},
		health_parents: {
			type: Sequelize.STRING
		},
		sleep: {
			type: Sequelize.STRING
		},
		allergies: {
			type: Sequelize.STRING
		},
		serious_illness: {
			type: Sequelize.STRING
		},
		major_addiction: {
			type: Sequelize.STRING
		},
		medications: {
			type: Sequelize.STRING
		},
		therapies: {
			type: Sequelize.STRING
		},
		interests: {
			type: Sequelize.INTEGER,
		},
		preferred_style: {
			type: Sequelize.INTEGER
		}

	},
	{
		timestamps: false
	}
);
