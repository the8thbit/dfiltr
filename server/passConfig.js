module.exports = function( passport ) {
	var localStrat = require( 'passport-local' ).Strategy;
	
	passport.use( 'local', new localStrat( function( username, password, done ) {
		User.findOne( { username: username }, function( err, user ) {
			if( err ) { status = 'error'; }
			if( !user ) { 
				return done( null, false, { message: 'bad name' } );
			} else {
				console.log( 'tryin it out: ' + user.password );
				user.comparePassword( password, user.password, function( err, isMatch ) {
					if( err ) {
						console.log( 'error: ' + err ); 
						return done( err );
					} else if( !isMatch ) {
						return done( null, false, { message: 'bad pass' } );
					} else {
						return done( null, user );
					}						 	
				});
			}
		});
	}));

	passport.serializeUser( function( user, done ) {
		done( null, user.username );
	});

	passport.deserializeUser( function( username, done ) {
		User.findOne( { username: username }, function( err, user ) {
			done( err, user );
		});
	});
};

