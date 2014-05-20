module.exports = function( app ){
	//use jade templates for HTML
	app.set( 'views', __dirname + '/../../client' );
	app.set( 'view engine', 'jade' );
	app.engine( 'jade', require( 'jade' ).__express );

	//get the JADE template pages used in the project
	app.get( '/',                               function( req, res ){ res.render( 'splash/splash'                               ); } );
	app.get( '/chat',                           function( req, res ){ res.render( 'chat/chat'                                   ); } );
	app.get( '/chat/ratings',                   function( req, res ){ res.render( 'chat/ratings/ratings'                        ); } );

	app.get( '/help',                           function( req, res ){ res.render( 'help/help'                                   ); } );

	app.get( '/profile/convos',                 function( req, res ){ res.render( 'profile/convos/convos'                       ); } );
	app.get( '/profile/convos/convoListElm',    function( req, res ){ res.render( 'profile/convos/convoListElm/convoListElm'    ); } );
	app.get( '/profile/convos/convo',           function( req, res ){ res.render( 'profile/convos/convo/convo'                  ); } );
	app.get( '/profile/badges',                 function( req, res ){ res.render( 'profile/badges/badges'                       ); } );
	app.get( '/profile/badges/badgeView',       function( req, res ){ res.render( 'profile/badges/badgeView/badgeView'          ); } );
	app.get( '/profile/options',                function( req, res ){ res.render( 'profile/options/options'                     ); } );
	app.get( '/profile/mail',                   function( req, res ){ res.render( 'profile/mail/mail'                           ); } );
	app.get( '/profile/mail/mailListElm',       function( req, res ){ res.render( 'profile/mail/mailListElm/mailListElm'        ); } );
	app.get( '/profile/mail/mailConvo',         function( req, res ){ res.render( 'profile/mail/mailConvo/mailConvo'            ); } );
	app.get( '/profile/mail/mailInput',         function( req, res ){ res.render( 'profile/mail/mailInput/mailInput'            ); } );

	app.get( '/scoreboard/users',               function( req, res ){ res.render( 'scoreboard/users/users'                      ); } );
	app.get( '/scoreboard/users/userListElm',   function( req, res ){ res.render( 'scoreboard/users/userListElm/userListElm'    ); } );
	app.get( '/scoreboard/convos',              function( req, res ){ res.render( 'scoreboard/convos/convos'                    ); } );
	app.get( '/scoreboard/convos/convoListElm', function( req, res ){ res.render( 'scoreboard/convos/convoListElm/convoListElm' ); } );
	app.get( '/scoreboard/convos/convo',        function( req, res ){ res.render( 'scoreboard/convos/convo/convo'               ); } );
	app.get( '/scoreboard/badges',              function( req, res ){ res.render( 'scoreboard/badges/badges'                    ); } );
	app.get( '/scoreboard/badges/badgeView',    function( req, res ){ res.render( 'scoreboard/badges/badgeView/badgeView'       ); } );

	app.get( '/modules/dock/auth',              function( req, res ){ res.render( 'modules/dock/dock_in'                        ); } );
	app.get( '/modules/dock',                   function( req, res ){ res.render( 'modules/dock/dock_out'                       ); } );
	app.get( '/modules/login',                  function( req, res ){ res.render( 'modules/login/login'                         ); } );


	app.get( '/user', function( req, res ){ res.render( 'profile/profile' ); } );
	// create the paths for all of the user profile pages
	app.get( '/user/:username', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			if( user ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get( '/user/:username/convos', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			if( user ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'convos'
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get( '/user/:username/convos/:convo', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			Convo.findOne( { _id: req.params.convo }, function( err, convo ){
				if( user && convo ){
					res.render('profile/profile', {
						profileData: {
							name: user.username,
							deltas: user.deltas,
							badges: user.badges,
							view: 'convo',
							convo: JSON.stringify( convo )
						}
					});
				} else {
					res.render( 'chat/chat' );
				}
			});
		});
	});

	app.get( '/user/:username/badges', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			if( user ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'badges'
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get( '/user/:username/mail', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			if( user ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'mail'
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get('/user/:username/mail/:to', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			Mail.findOne( { to: req.params.to }, function( err, mail ){
				if( user && mail ){
					res.render('profile/profile', {
						profileData: {
							name: user.username,
							deltas: user.deltas,
							badges: user.badges,
							view: 'mailConvo',
							convo: JSON.stringify( mail )
						}
					});
				} else {
					res.render( 'chat/chat' );
				}
			});
		});
	});
	
	app.get('/user/:username/options', function( req, res ){
		User.findOne( { username: req.params.username }, function( err, user ){
			if( user ){
				res.render('profile/profile', {
					profileData: {
						name: user.username,
						deltas: user.deltas,
						badges: user.badges,
						view: 'options'
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get( '/stats', function( req, res ){
		res.render('scoreboard/scoreboard', {
			scoreboardData: {}
		});
	});

	app.get( '/stats/users', function( req, res ){
		res.render('scoreboard/scoreboard', {
			scoreboardData: { view: 'users' }
		});
	});

	app.get( '/stats/convos', function( req, res ){
		res.render('scoreboard/scoreboard', {
			scoreboardData: { view: 'convos' }
		});
	});

	app.get( '/stats/convos/:convo', function( req, res ){
		Convo.findOne( { _id: req.params.convo }, function( err, convo ){
			if( convo ){
				res.render('scoreboard/scoreboard', {
					scoreboardData: {
						view: 'convo',
						convo: JSON.stringify( convo )
					}
				});
			} else {
				res.render( 'chat/chat' );
			}
		});
	});

	app.get( '/stats/badges', function( req, res ){
		res.render('scoreboard/scoreboard', {
			scoreboardData: { view: 'badges' }
		});
	});
}
