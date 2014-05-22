module.exports = function( app ){
	var config       = require( './../config.js' );
	var passport     = require( 'passport' );
	var passportSIO  = require( 'passport.socketio' );
	var passConfig   = require( './passConfig.js' )( passport );
	var sessionStore = require( 'sessionstore' );

	app.use( app.express.urlencoded() );
	app.use( app.express.cookieParser() );
	sessionStore.mongo = sessionStore.createSessionStore( {
		type:           'mongoDb',
		username:       config.MONGO_USER,
		password:       config.MONGO_PASS,
		host:           config.MONGO_IP,
		port:           config.MONGO_PORT,
		dbName:         config.MONGO_DB_NAME,
		collectionName: 'sessions'
	});

	app.use( app.express.session( { 
		key:    '435.sid',
		secret: config.COOKIE_SECRET,
		store:  sessionStore.mongo
	}));

	//use pasport for managing user authentication and sessions
	app.use( passport.initialize() );
	app.use( passport.session() );

	var createUser  = function( body ){
		var newUser = new User( {
			username:  body.username,
			password:  body.password,
			email:     body.email,
			pio_user:  null,
			pio_items: [],
			flags:     0,
			deltas:    0,
			badges:    0,
		});
		if( app.pioMode ){ createPioUser( newUser ); }
		newUser.save();
		return newUser;
	};

	//create the predictionIO user and items associated with the account
	var createPioUser = function( newUser ){
		var pioItemNum = app.pio.items.index.value;
		app.pio.users.index.value += 1;
	
		//create the predictionIO user
		app.pio.users.create( {
			pio_uid: app.pio.users.index.value,
			pio_inactive: false
		}, function( err, res ){ //when the user has been created, create its items: Each user has app.pio.ITEMS_PER_USER items associated with it
			newUser.pio_user = app.pio.users.index.value;
			User.findByIdAndUpdate(  newUser._id,             { pio_user: newUser.pio_user          } ).error( app.handleErr );
			Index.findByIdAndUpdate( app.pio.users.index._id, { value:    app.pio.users.index.value } ).error( app.handleErr );
			if( app.pioMode ){ createPioItems( newUser ) };
			app.handleErr;
		})
	}

	var createPioItems = function( newUser ){
		for( var i=0; i < app.pio.ITEMS_PER_USER; i+=1 ){
			app.pio.items.index.value += 1;
			app.pio.items.create( {
				pio_iid: pio.items.index.value,
				pio_itypes: 'uitem',
				pio_inactive: false
			}, function( err, res ){
				pioItemNum += 1;
				newUser.pio_items.push( pioItemNum );
				if( newUser.pio_items.length == app.pio.ITEMS_PER_USER ){
					User.findByIdAndUpdate(  newUser._id,             { pio_items: newUser.pio_items         } ).error( app.handleErr );
					Index.findByIdAndUpdate( app.pio.items.index._id, { value:     app.pio.items.index.value } ).error( app.handleErr );
				}
				app.handleErr;
			});
		}
	}

	return { 
		'passport':     passport,
		'passportSIO':  passportSIO,
		'passConfig':   passConfig,
		'createUser':   createUser,
		'sessionStore': sessionStore
	}
}
