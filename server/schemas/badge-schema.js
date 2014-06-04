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
	title: 'An Easy Badge',
	image: 'E',
	difficulty: 'easy',
	ownerNum: 0,
	description: 'this is an easy test badge to show you what badges look like'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'A Medium Badge',
	image: 'M',
	difficulty: 'medium',
	ownerNum: 0,
	description: 'this is a medium test badge to show you what badges look like'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'A Hard Badge',
	image: 'H',
	difficulty: 'hard',
	ownerNum: 0,
	description: 'this is a hard test badge to show you what badges look like'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Delta Giver',
	image: 'Δ',
	difficulty: 'easy',
	ownerNum: 0,
	description: 'You had your view changed.'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Daily Double',
	image: '?',
	difficulty: 'medium',
	ownerNum: 0,
	description: 'You improved dfiltr by giving us a good idea for a question!'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Bug Killer',
	image: '🐱',
	difficulty: 'hard',
	ownerNum: 0,
	description: 'You helped to make dfiltr better by fixing a bug in our code!'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Longterm Member',
	image: 'ℒ',
	difficulty: 'hard',
	ownerNum: 0,
	description: 'You had your view changed.'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Another Badge',
	image: 'Ω',
	difficulty: 'hard',
	ownerNum: 0,
	description: 'This is honestly just here to make it seem like we have more badges.'
});
newBadge.save();
var newBadge = new Badge( {
	title: 'Yet Another Badge',
	image: 'ℝ',
	difficulty: 'easy',
	ownerNum: 0,
	description: 'This is honestly just here to make it seem like we have more badges.'
});
newBadge.save();

module.exports = mongoose.model( 'badges', badgesSchema );


