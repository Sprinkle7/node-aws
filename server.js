var express  	= require('express');
var cors 		= require('cors');
var bodyParser 	= require('body-parser');
var app 		= express();
var port 		= process.env.PORT || 5000; 

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'))

// Getting Routes
var Users = require('./routes/Users');
var Userapi = require('./routes/Userapi');
var Interest = require('./routes/Interest');
var Styles = require('./routes/Styles');

// Using Routes in App
app.get('/', (req, res) => {
	res.json({
		data: 'The Server is Working',
	});
})
app.use('/users', Users);
app.use('/userapi', Userapi);
app.use('/interest', Interest);
app.use('/styles', Styles);


// Starting Server
app.listen(port, () => {
	console.log('Server is running on port: ' + port);
});