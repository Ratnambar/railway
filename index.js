var express=require('express');
const app=express();
var fs=require('fs');
var path=require('path');
var url=require('url');
var request=require('request');
var https=require('https');
var bodyParser = require('body-parser');
const _ = require('lodash');
const hbs=require('hbs');
var http=require('http');
var {mongoose} = require('./db/mongoose');
var {Contact} = require('./models/contactUs');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/public/partials');

app.get('/home',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'home.html'));
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'route.html'));
});

app.get('/live',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'live-train.html'));
});

app.get('/between',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'between.html'));
});

app.get('/about',function(req,res){
	res.sendFile(path.join(__dirname + '/public','about.html'));
});

app.get('/seat',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'seatAvl.html'));
});

app.get('/pnr',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'PNR.html'));
})

app.get('/code',function(req,res){
	res.sendFile(path.join(__dirname + '/public', 'codeToname.html'));
});

app.post('/Route',function(req,res){
	request({
		url:'https://api.railwayapi.com/v2/route/train/'+req.body.tnum+'/apikey/kr040xjd3i/',json:true
	},function(error,response,body){
		if(error){throw error;}
            // console.log(JSON.stringify(body,undefined,2));
        res.render('route',body);
	});

});

app.post('/Status',function(req,res){
	// console.log(body);
	request({
		url:'https://api.railwayapi.com/v2/live/train/'+req.body.tnum+'/station/'+req.body.stnCode+'/date/'+req.body.date+'/apikey/kr040xjd3i/',json:true
	},function(error,response,body){
		if(error){throw error;}
     	console.log(req.body.date);
     	// res.render('liveStatus',body);

	});
});

app.post('/trainBetween',function(req,res){
	request({
		url:'https://api.railwayapi.com/v2/between/source/'+req.body.srcStn+'/dest/'+req.body.destStn+'/date/'+req.body.date+'/apikey/kr040xjd3i/',json:true
	},function(error,response,body){
		if(error){throw error;}
		res.render('between',body);
		// console.log(req.body.date);
		// // console.log(body);
	});
});

app.post('/AvlSeat',function(req,res){
	request({
		url:'https://api.railwayapi.com/v2/check-seat/train/'+req.body.tnum+'/source/'+req.body.SrcstnCode+'/dest/'+req.body.DeststnCode+'/date/'+req.body.date+'/pref/'+req.body.pref+'/quota/'+req.body.quota+'/apikey/qyy763hp4c/',json:true
	},function(error,response,body){
		if(error){throw error;}
		res.render('seatavl',body);
	});
});

app.post('/PNR',function(req,res){
	request({
		url:'https://api.railwayapi.com/v2/pnr-status/pnr/'+req.body.pnr+'/apikey/qyy763hp4c/',json:true
	},function(error,response,body){
		if(error){throw  error;}
		res.render('pnr',body);
	});
});


app.post('/toname',function(req,res){
	request({
		url:'https://api.railwayapi.com/v2/code-to-name/code/'+req.body.stnCode+'/apikey/qyy763hp4c/',json:true
	},function(error,response,body){
		if(error){throw error;}
		console.log(JSON.stringify(body,undefined,2));
	});
});

app.post('/contact',(req,res)=>{
	var contact = new Contact({
	  name : req.body.name,
	  email : req.body.email,
	  phone : req.body.phone,
	  desc : req.body.desc
	});

	contact.save().then((doc)=>{
	  console.log('inserted');
		res.redirect('/home');
	},(e)=>{
	  res.send(e);
	});
});

app.listen(3000,function(err,res){
	if(err){
		throw err;
	}console.log("listening to the port");
});
