//=============================================================================
//BADGES-SCHEMA
//=============================================================================
var mongoose = require( 'mongoose' );
var schema = mongoose.Schema

var ownerSchema = new schema( {
	username: { type: String, required: true },
	date:     { type: Date,   required: false, default: Date.now }
});

var badgesSchema = new schema( {
	title:       { type: String,        required: true, unique: true },
	image:       { type: String,        required: true  },
	difficulty:  { type: String,        required: true  },
	description: { type: String,        required: false },
	custom:      { type: String,        required: false },
	ownerNum:    { type: Number,        required: true  },
	owners:      { type: [ownerSchema], required: false },
	date:        { type: Date, required: false, default: Date.now }
});

var Badge = mongoose.model( 'badges', badgesSchema );

var newBadge = new Badge( {
	title: 'Test Badge',
	image: 'T',
	difficulty: 'easy',
	description: 'this is a test badge',
	ownerNum: 1,
	owners: [{
		username: 'dave'
	}]
});
newBadge.save();

module.exports = mongoose.model( 'badges', badgesSchema );


