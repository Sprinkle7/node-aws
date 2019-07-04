const fs 		= require('fs');
const express 	= require('express');
const userapi   = express.Router();
const cors	  	= require('cors');
const jwt 		= require("jsonwebtoken");
const bcrypt 	= require("bcrypt");
const Sequelize = require('sequelize');
const nodeMailer= require('nodemailer'),
const { check, validationResult } = require('express-validator');


/* Loading All Models */
const User 		= require("../models/User");
const Health 	= require("../models/Userhealth");
const Feelings 	= require("../models/Feelings");
const Food 		= require("../models/Food");
const Water 	= require("../models/water");
const db 		= require("../database/db");
const general 	= require("../helps/general");
/* Model loading ends here */

/* Sequelize Configuration */
const op = Sequelize.Op
/* ends here */


/* Multer For File Uploading Configuration */

var multer  	= require('multer');
var storage 	= multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/food/')
	},
	filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
}
});
var upload = multer({ storage: storage });

/* Multer File Upload Ends Here */

userapi.use(cors());

/* User Registration Mobile Side */
userapi.post('/register', [
	
	check('email')
	.isEmail()
	.withMessage('Email is incorrect. Please Enter A Valid Email'),

	check('password')
	.isLength({ min: 6 })
	.withMessage('Password Must Be Atleast 6 Characters'),

	check('goal')
	.not()
	.isEmpty()
	.trim()
	.escape()
	.withMessage('Goal Must Be Written'),
	
	check('terms')
	.not()
	.isEmpty()
	.withMessage('User should accept terms & Conditions')
	],(req, res) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const today = new Date();
		const userData = {
			interests: 			req.body.interest_id,
			preferred_style: 	req.body.style,
			goal: 				req.body.goal,
			first_name: 		req.body.first_name,
			last_name: 			req.body.last_name,
			date_of_birth: 		req.body.dob,
			email: 				req.body.email,
			password: 			req.body.password,
			terms_acceptance: 	req.body.terms,
			created: 			today
		}

		User.findOne({
			where: {
				email: req.body.email
			}
		})
		.then(user => {
			if (!user) {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					userData.password = hash;
					User.create(userData)
					.then(user => {
						var userdata = {
							id: user.id,
							login_token: token,
							email: user.email,
							first_name: user.first_name,
							last_name: user.last_name
						}
						res.json(general.success('User Registration Successfull',userdata));
					})
					.catch(err => {
						res.json(general.failure('User Registration Failed'));
					});
				})
			}
			else
			{
				user.password = '';
				res.json(general.failure('User already Exists',user));
			}
		})
		.catch(err => {
			res.json(general.failure('Got Errors'));
		});
});
/* User login Mobile */
userapi.post('/login', (req, res) => {
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
/* Forgot Password */
userapi.post('/forgotpassword', (req, res) => {
	let transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'xxx@xx.com',
			pass: 'xxxx'
		}
	});
	let mailOptions = {
          from: '"Krunal Lathiya" <xx@gmail.com>', // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // Subject line
          text: req.body.body, // plain text body
          html: '<b>NodeJS Email Tutorial</b>' // html body
      };

    User.findOne({
    	where: {
    		email: req.body.email
    	}
    })
    .then(user => {
    	transporter.sendMail(mailOptions, (error, info) => {
	  		if (error) {
	  			return console.log(error);
	  		}	
	  		data = {
	  			message_id: info.messageId, 
	  			response: info.response
	  		}
	  		res.json(general.success('Email Send Successfully', data));
	  	});
    })
    .catch(err => {
    	res.json(general.failure('Email Not Found'));
    });
});
/* Code Verification */
userapi.post('/verifycode', (req, res) => {
    User.findOne({
    	where: {
    		email_token: req.body.token
    	}
    })
    .then(user => {
    	data = { verified: true, user_id: user.id }
	  	res.json(general.success('Token is verified', data));
    })
    .catch(err => {
    	res.json(general.failure('Token does not exists'));
    });
});
/* Reset Password */
userapi.post('/resetpassword', (req, res) => {
    User.findOne({
    	where: {
    		id: req.body.userid
    	}
    })
    .then(user => {
    	bcrypt.hash(req.body.password, 10, (err, hash) => {
			userData.password = hash;
			User.update({
				password: req.body.password
			},{
				where: {
					id : req.body.userid
				}
			})
			.then(user => {
				var userdata = {
					id: user.id,
					login_token: token,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name
				}
				res.json(general.success('Password Reset Successfully',userdata));
			})
			.catch(err => {
				res.json(general.failure('Password Reset Failed'));
			});
		})
    })
    .catch(err => {
    	res.json(general.failure('User does not exists'));
    });
});

// Updating Health Goals
userapi.post('/healthgoal', [
	check('weight')
	.isEmpty()
	.withMessage('Weight Should be mentioned.'),
	
	check('description')
	.isEmpty()
	.trim()
	.escape('Give Us some Reasons to believe')

	], (req, res) => {

		User.update({
			target_weight: req.body.weight,
			target_description: req.body.description
		},{
			where: 
			{
				id: req.body.userid
			}
		})
		.then(user => {
			res.json(general.success('Health Goal Updated',user));
		})
		.catch(err => {
			res.json(general.failure('Failed To Update Goals'));
		});
	});


// User Health Information
userapi.post('/userhealths', (req, res) => {

	var healthInfo = {
		weight: req.body.weight,
		bmi: req.body.bmi,
		muscle: req.body.muscle,
		water: req.body.water,
		bmr: req.body.bmr,
		metabolic: req.body.metabolic,
		bone: req.body.bone,
		fat: req.body.fat,
		user_id: req.body.userid
	};	

	Health.create(healthInfo)
	.then(heal => {
		res.json(general.success('Your health information is added successfully',heal));
	})
	.catch(err => {
		res.json(general.failure('We are unable to save your information'));
	})

});

// Relationship Status
userapi.post('/relationship', (req, res) => {

	userid = req.body.userid;
	User.findOne({
		where: 
		{
			id: userid
		}
	})
	.then(users => {
		User.update({
			relation_status: req.body.relation_status,
			no_childs: req.body.no_childs,
			occupation: req.body.occupation,
			hours_per_week: req.body.hours_per_week,
			nationality: req.body.nationality,
			current_living: req.body.current_living
		},{
			where: 
			{
				id: userid
			}
		})
		.then(user => {
			res.json(general.success('Social Information Updated',users));
		})
		.catch(err => {
			res.json(general.failure('Failed To Update Information'));
		});
	})
	.catch(err => {
		res.json(general.failure('User details not found'));
	});
	
});

// Health information

userapi.post('/healthinformation', (req, res) => {
	userid = req.body.userid;
	User.findOne({
		where: {
			id: userid
		}
	})
	.then(user => {
		User.update({
			height: req.body.height,
			weight: req.body.weight,
			health_parents: req.body.health_parents,
			sleep: req.body.sleep,
			allergies: req.body.allergies,
			serious_illness: req.body.serious_illness,
			major_addiction: req.body.major_addiction,
		},{
			where: {   
				id: userid
			}
		})
		.then(output => {
			res.json(general.success('Health information updated',user));
		})
		.catch(err => {
			res.json(general.failure('Failed to update health information'));
		});
	})
	.catch(err => {
		res.json(general.failure('User details not found'));
	});
});

// getUser

userapi.post('/user', (req, res) => {
	User.findOne({
		where:{
			id: req.body.userid
		}
	})
	.then(user => {
		res.json(general.success('User details',user));
	})
	.catch(err => {
		res.json(general.failure('User details not found'));
	});
});



// Health information

userapi.post('/medicalinformation', (req, res) => {
	userid = req.body.userid;
	User.findOne({
		where: {
			id: userid
		}
	})
	.then(user => {
		User.update({
			medications: req.body.medications,
			therapies: req.body.therapies
		},{
			where: {   
				id: userid
			}
		})
		.then(output => {
			res.json(general.success('Medical information updated',user));
		})
		.catch(err => {
			res.json(general.failure('Failed to update medical information'));
		});
	})
	.catch(err => {
		res.json(general.failure('User details not found'));
	});
});


// Feelings information

userapi.post('/feelingtoday', (req, res) => {
	var userData = {
		user_id: req.body.userid,
		emoji_no: req.body.emoji_no
	}

	Feelings.create(userData)
	.then(feelings => {
		res.json(general.success('Feelings Updated For Today',feelings));
	})
	.catch(err => {
		res.json(general.failure('Failed to update feelings'));
	});
});


// Feelings information

userapi.post('/foodtoday', upload.single('image'), (req, res) => {
	const image = req.file.filename;
	Food.findAll({
		raw: true,
		attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('image')), 'images']],
		createdAt: {
			[op.lte]: new Date(),
			[op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
		}
	})
	.then(data => {
		var count;
		for (var i in data) {
			count = data[i]['images']
		}
		if (count >= 6) {
			fs.unlink('./public/food/'+image,(err, data) => {
				console.log(data, ' +++ Errors: ', err);
			})
			res.json(general.failure('Daily Updation is Complete'));
		}
		else{
			var userData = {
				user_id: req.body.userid,
				food_type: req.body.food_type,
				image: image
			}

			Food.create(userData)
			.then(food => {
				res.json(general.success(req.body.food_type+' Added',food));
			})
			.catch(err => {
				res.json(general.failure('Failed to update '+ req.body.food_type));
			});
		}
	});
	
});


// Feelings information

userapi.post('/watertoday', (req, res) => {

	var userData = {
		user_id: req.body.userid,
		glass: req.body.glass
	}
	Water.create(userData)
	.then(water => {
		res.json(general.success('Quantity Of Water Added',water));
	})
	.catch(err => {
		res.json(general.failure('Failed to Added'));
	});
	
});



module.exports = userapi