const express 	= require("express");
const styles  = express.Router();
const cors 		= require("cors");
const jwt 		= require("jsonwebtoken");
const bcrypt 	= require("bcrypt");
const Styles 	= require("../models/Styles");
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

styles.use(cors());
process.env.SECRET_KEY = 'secret';

styles.post('/plusstyle', upload.single('icon'), (req, res) => {
	const today = new Date();
	const iconname = req.file.filename;

	const interestData = {
		name: req.body.name,
		icon: iconname
	}

	Styles.findOne({
		where: { name: req.body.name }
	})
	.then(inters => {
		if (!inters) 
		{
			Styles.create(interestData)
			.then(inters => {
				res.json({
					status: 200,
					success: true,
					message: 'Added Successfully',
					data: inters
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

styles.get('/styles', (req, res) => {
	Styles.findAll({
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

styles.get('/get', (req,res) => {
	var id = req.query.id;
	Styles.findOne({
		where: {id:id}
	})
	.then(inter => {
		res.json({
			status: 200,
			success: true,
			msg: 'Specific Style',
			data: inter
		});
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			msg: 'Style not Found'
		});
	});
});

styles.post('/update', upload.single('icon'), (req, res) => {

	var iconname;
	var name = req.body.name;
	var id = req.body.interest_id;

	if (typeof req.query.filename != 'undefined' && req.query.filename != '') 
	{
		iconname = req.file.filename;
	}

	Styles.findOne({
		where: { id: id }
	})
	.then(inters => {
		
		Styles.update({
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

styles.get('/delete', (req,res) => {
	var id = req.query.id;
	Styles.destroy({
		where: {id:id}
	})
	.then(inter => {
		res.json({
			status: 200,
			success: true,
			msg: 'Style Deleted Successfully'
		});
	})
	.catch(err => {
		res.json({
			status: 500,
			success: false,
			msg: 'Style not Found'
		});
	});
});

module.exports = styles