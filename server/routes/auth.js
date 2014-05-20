module.exports = function( app ){
	app.get(  '/login',       function( req, res, next ){ this.login(       req, res, next ); } );	
	app.post( '/register',    function( req, res, next ){ this.register(    req, res, next ); } );
	app.post( '/changePass',  function( req, res, next ){ this.changePass(  req, res, next ); } );	
	app.post( '/changeEmail', function( req, res, next ){ this.changeEmail( req, res, next ); } );	
	app.get(  '/isLogged',    function( req, res, next ){ this.isLogged(    req, res, next ); } );	
	app.get(  '/logout',      function( req, res, next ){ this.logout(      req, res, next ); } );

	this.login = function( req, res, next ){
		app.auth.passport.authenticate( 'local', function( err, user, info ){
			if( info && info.message == 'bad name' ){
				res.send( 'bad name' );
			} else if( info && info.message == 'bad pass' ){
				res.send( 'bad pass' );
			} else if( user ){
				req.logIn( user, function( err ){ 
					if( err ){
						console.log( 'login error: ' + err );
						res.send( err ); 
					} else {
						res.send( user );
					}
				});
			} else {
				res.send( 'login error' );
				console.log( 'login error: ' + err );
			}
		})( req, res, next );
	}

	this.register = function( req, res, next ){
		User.findOne( { username: req.body.username }, function( err, user ){
			app.handleErr( err, function( err ){
				if( err ){ return res.send( err ); } 
			});
			if( user ){
				return res.send( 'bad name' );
			} else {
				//does the email exist already?
				User.findOne( { email: req.body.email }, function( err, user ){
					if( err ){
						console.log( 'registration error: ' + err );
						return res.send( err );
					} else if( req.body.email && user ){
						return res.send( 'bad email' );
					} else {
						req.login( app.auth.createUser( req.body ), function( err ){ if( err ){ console.log( err ); } } );
						return res.send( 'success' );
					}
				});
			}
		});
	}

	this.changePass = function( req, res, next ){
		req.user.comparePassword( req.body.old, req.user.password, function( err, isMatch ){
			app.handleErr( err, function( err ){
				if( err ){ return res.send( 'bad pass' ); } 
			});
			if( !isMatch ){
				res.send( 'bad pass' );
			} else {
				req.user.password = req.body.new;
				req.user.save();
				return res.send( 'success' );
			}
		});
	}

	this.changeEmail = function( req, res, next ){
		req.user.comparePassword( req.body.pass, req.user.password, function( err, isMatch ){
			app.handleErr( err, function( err ){
				if( err ){ return res.send( 'bad pass' ); } 
			});
			if( !isMatch ){
				res.send( 'bad pass' );
			} else {
				req.user.email = req.body.new;
				req.user.save();
				return res.send( 'success' );
			}
		});
	}

	this.isLogged = function( req, res, next ){
		if( req.user ){
			return res.send( req.user );
		} else {
			return res.send( false );
		}
	}

	this.logout = function( req, res, next ){
		req.logout();
		res.redirect( '/' );
	}

	return this;
}
