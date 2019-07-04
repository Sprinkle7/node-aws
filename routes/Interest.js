const express 	= require("express");
const interest  = express.Router();
const cors 		= require("cors");
const jwt 		= require("jsonwebtoken");
const bcrypt 	= require("bcrypt");
const Interest 	= require("../models/Interests");
const db 		= require("../database/db");
var multer  	= require('multer');

var storage 	= multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/')
	},
	filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
}
});
var upload = multer({ storage: storage });

interest.use(cors());
process.env.SECRET_KEY = 'secret';

interest.post('/plusinterest', upload.single('icon'), (req, res) => {
	const today = new Date();
	const iconname = req.file.filename;

	const interestData = {
		name: req.body.name,
		icon: iconname
	}

	Interest.findOne({
		where: { name: req.body.name }
	})
	.then(interest => {
		if (!interest) 
		{
			Interest.create(interestData)
			.then(interest => {
				res.json({
					status: 200,
					success: true,
					message: 'Added Successfully',
					data: interest
				});
			})
			.catch( err => {
				res.json({
					status: 500,
					success: false,
					message: 'Failed'
				});
			});
		}
		else
		{
			res.json({
				status: 500,
				success: false,
				message: 'Already Exists'
			});
		}

	})
	.catch(err => {
		res.json({status: err})
	});
});

interest.get('/interests', (req, res) => {
	Interest.findAll({
		attributes: ['id','name','icon']
	})
	.then(interests => {
		res.json({
			status: 200,
			success: true,
			msg: 'All Interests',
			data: interests
		});
	}).
	catch(err => {
		res.json({
			status: 500,
			success: false,
			msg: 'No interests Found',
		});
	});
});

interest.get('/get', (req,res) => {
	var id = req.query.id;
	Interest.findOne({
		where: {id:id}
	})
	.then(inter => {
		res.json({
			status: 200,
			success: true,
			msg: 'Specific Interest',
			data: inter
		});
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			msg: 'Interest not Found'
		});
	});
});

interest.post('/update', upload.single('icon'), (req, res) => {

	var iconname;
	var name = req.body.name;
	var id = req.body.interest_id;

	if (typeof req.query.filename != 'undefined' && req.query.filename != '') 
	{
		iconname = req.file.filename;
	}

	Interest.findOne({
		where: { id: id }
	})
	.then(inters => {
		
		Interest.update({
			name: name,
			icon: inters.icon
		},
		{
			where: { id: id }
		})
		.then(inter => {
			res.json({
				status: 200,
				success: true,
				msg: 'Updated Successfully',
				data: inters
			});
		})
		.catch(err => {
			res.json({
				status: 200,
				success: false,
				msg: 'Updation Failed'
			});
		});

	})
	.catch(err => {
		res.json({msg: 'Server Error'});
	});

});

interest.get('/delete', (req,res) => {
	var id = req.query.id;
	Interest.destroy({
		where: {id:id}
	})
	.then(inter => {
		res.json({
			status: 200,
			success: true,
			msg: 'Interest Deleted Successfully'
		});
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			msg: 'Interest not Found'
		});
	});
});

module.exports = interest