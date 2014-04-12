var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../../config.js"><\/script>' )

var profile = $( '#profile' );

window.onload = function() {
	profile.socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/mail' );
	profile.dock      = $( '#profile-dock' );     //the place where the user dock goes
	profile.content   = $( '#profile-content' );
	profile.headerbar = $( '#profile-headerbar' );
	profile.input     = $( '#profile-input' );
	profile.viewer    = $( '#profile-viewer' );

	profile.socket.on( 'message', function( data ) {
		console.log( data );
		mail_convo.add( { message: data.message, type:'partner' } );
	});	

	window.onresize = function( event ) {
		profile.resize();
	};

	profile.resize = function() {
		profile.content.css( { 'height': $( window ).height() - ( profile.dock.outerHeight() + 10 ) } ) 
		profile.viewer.css( { 'height': $( window ).height() - ( profile.dock.outerHeight() + 17 + profile.headerbar.outerHeight() + profile.input.outerHeight() ) } )
	};

	$( '.profile-faded' ).hover(
		function() { //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 'fast', 0.7 );
		}
	);
	$( '.profile-faded' ).click( function() {
		$( '.profile-faded' ).css( 'background-color', '#0B5FA5' );
		$( this ).css( 'background-color', '#FF4C00' );
	});

	$( '#profile-headerbar-tabs-delta' ).click( function() { 
		profile.viewer.load( '/profile/delta/', function() { delta.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
	});

	$( '#profile-headerbar-tabs-badges' ).click( function() { 
		profile.viewer.load( '/profile/badges/', function() { badges.init(); } );
	});

	$( '#profile-headerbar-tabs-mail' ).click( function() { 
		profile.viewer.load( '/profile/mail/', function() { mail.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
	});

	$( '#profile-headerbar-tabs-options' ).click( function() { 
		profile.viewer.load( '/profile/options/', function() { options.init(); } );
	});


	//==========================================================================
	// Initialization
	//==========================================================================
	profile.resize();

	//default to delta view
	profile.viewer.load( '/profile/delta/', function() { delta.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
	$( '#profile-headerbar-tabs-delta' ).css( 'background-color', '#FF4C00' );

	$( '.profile-faded' ).fadeTo( 0, 0.6 );

	$.get( '/isLogged', function( res ) {
		if( res ) {
			profile.dock.load( '/modules/dock/auth' );
		} else {
			profile.dock.load( '/modules/dock/' );
		}
	});
}
