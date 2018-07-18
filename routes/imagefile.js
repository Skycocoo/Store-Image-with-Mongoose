// modified by Yuxi Luo, July 2018

var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require("body-parser");
var fs = require("fs");
var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
	data: Buffer,
	originalname: String,
	contentType: String,
});

var Image = module.exports = mongoose.model('files', ImageSchema);

router.getImages = function(callback) {
    Image.find(callback);
}

router.getImageById = function(id, callback) {
    Image.findById(id, callback);
}

router.addImage = function(image, callback) {
	Image.create(image, callback);
}


router.get('/', function(req, res, next) {
    res.render('index.ejs');
});


// https://github.com/expressjs/multer#memorystorage
// use memoryStorage to generate buffer for the file
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/', upload.any(), function(req, res) {
    var image = {};
	image['data'] = req.files[0].buffer;
	image['originalname'] = req.files[0].originalname;
	image['contentType'] = req.files[0].mimetype;

	// console.log(image['data']);
	router.addImage(image, (err, docs) => {
		if (err) {
			console.log(err.message);
			throw err;
		}
		
		res.send(docs['_id']);
		console.log("Successfully inserted one image!");
	});


});

//======================================================================================

router.get('/picture/:id',function(req,res){
	Image.findById(req.params.id,function(err,file){
		if (err) {
			throw err;
		}
		// display image from arrayBuffer stored in database
		res.render("home.ejs",{image: 'data:image/png;base64,' + base64ArrayBuffer(file.data)});
	});
});

//======================================================================================


// https://gist.github.com/jonleighton/958841#gistcomment-1953137
function base64ArrayBuffer(arrayBuffer) {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a;
  let b;
  let c;
  let d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63;        // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`;
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
  }

  return base64;
}

module.exports = router;
