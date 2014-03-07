var config  = require( './../../config.js' );

//=============================================================================
//ESTABLISH CONNECTION
//=============================================================================
var mongoose = require( 'mongoose' );
mongoose.connect( config.MONGO_IP + ':' + config.MONGO_PORT + '/chatappdb' );

var mongo = mongoose.connection;
mongo.on( 'error', console.error.bind( console, 'mongo error:' ) );

//=============================================================================
//LOAD SCHEMA
//=============================================================================
User = require( './user-schema.js' );

//create a new user
var newUser = new User( {
	username: 'testUser3',
	password: 'testPassword3'
});

// save new user to mongodb
newUser.save( function( err ) {
	if ( err ) throw err;

    	// fetch user and test password verification
	User.findOne( { username: 'testUser3' }, function( err, user ) {
 		if ( err ) throw err;

        	// test a matching password
		user.comparePassword( 'testPassword3', function( err, isMatch ) {
			if ( err ) throw err;
			console.log( 'testPassword3', isMatch ); 
		});

		// test a failing password
		user.comparePassword('123Password', function(err, isMatch) {
			if (err) throw err;
			console.log('123Password:', isMatch);
        	});
    	});
});



//=============================================================================
//SOME QUERYING AND OTHER DB FUNCTIONS
//=============================================================================

/*


//query document-- working
User.find( {username: "testUser1" }, function( err, users ) {
	if( err || !users ) console.log( "User not found!" );
  		else users.forEach( function( foundUser ) {
    		console.log( 'USERNAME: %s \nPASSWORD: %s', foundUser.username,foundUser.password );
	});
});


//update a document-- working
User.update( { username: "testUser1" }, { $set: { password: "changedpassword" } }, function( err, updated ) {
  	if( err || !updated ) console.log( "User not updated!" );
  		else console.log( "User updated!" );
});



*/






