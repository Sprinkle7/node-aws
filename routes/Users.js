const express 	= require("express");
const users 	= express.Router();
const cors 		= require("cors");
const jwt 		= require("jsonwebtoken");
const bcrypt 	= require("bcrypt");
const User 		= require("../models/User");
const db 		= require("../database/db");

users.use(cors());
process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
	const today = new Date();
	const userData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		created: today
	}

	User.findOne({
		where:{
			email: req.body.email
		}
	})
	.then( user => {
		if (!user) 
		{
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				userData.password = hash;
				User.create(userData)
				.then(user => {
					res.json({
						status: 200,
						success: true,
						message: 'User Registered Successfully',
						data: user
					});
				})
				.catch( err => {
					res.json({
						status: 500,
						success: false,
						message: 'Registration Failed'
					});
				});
			});
		}
		else
		{
			res.json({
				status: 500,
				success: false,
				message: 'User Already Exists'
			});
		}

	})
	.catch(err => {
		res.json({status: err})
	});
});


users.post('/login', (req, res) => {
	User.findOne({
		where:{
			email: req.body.email
		}
	})
	.then( user => {
		if (user) 
		{
			if (bcrypt.compareSync(req.body.password, user.password)) 
			{
				let token = jwt.sign(user.dataValues, process.env.SECRET_KEY,{
					expiresIn: 1400
				});
				res.json({
					status: 200,
					success: true,
					message: 'User Login Successfull',
					data: {
						id: user.id,
						login_token: token,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name
					}
				});
			}
			else
			{
				res.json({
					status: 500,
					success: false,
					message: 'Invalid Credientials'
				});
			}
		}
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			message: 'User Does Not Exists'
		});
	});
});

users.get('/allusers', (req, res) => {
	User.findAll({
		attributes: ['id','first_name','last_name','email','created']
	})
	.then(users => {
			res.json({
				status: 200,
				success: true,
				message: 'All Users Data',
				data: users
			});
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			message: 'Users Not Found'
		});
	});
});

module.exports = users