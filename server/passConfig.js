module.exports = function( passport ) {
	var localStrat = require( 'passport-local' ).Strategy;
	
	passport.use( 'local', new localStrat( function( username, password, done ) {
		User.findOne( { username: username }, function( err, user ) {
			if( err )   { return done( err ); }
			if( !user ) { return done( null, false ); }
			if( user.password != password ) { return done( null, false ); }
			return done( null, user );
		});
	}));

	passport.serializeUser( function( user, done ) {
		done( null, user );
	});

	passport.deserializeUser( function( obj, done ) {
		done( null, obj );
	});
};

