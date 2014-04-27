var profile = $( '#profile' );

profile.unhideTab = function( tabName ){
	if( tabName === 'delta' ){
		$( '#profile-headerbar-tabs-delta' ).css( 'display', 'table-cell' );
		$( '#profile-headerbar-tabs-delta' ).fadeTo( 0, 0.6 );
	} else if( tabName === 'badges' ){
		$( '#profile-headerbar-tabs-badges' ).css( 'display', 'table-cell' );
		$( '#profile-headerbar-tabs-badges' ).fadeTo( 0, 0.6 );
	} else if( tabName === 'mail' ){
		$( '#profile-headerbar-tabs-mail' ).css( 'display', 'table-cell' );
		$( '#profile-headerbar-tabs-mail' ).fadeTo( 0, 0.6 );
	} else if( tabName === 'options' ){
		$( '#profile-headerbar-tabs-options' ).css( 'display', 'table-cell' );
		$( '#profile-headerbar-tabs-options' ).fadeTo( 0, 0.6 );
	};
};

window.onload = function(){
	profile.dock      = $( '#profile-dock' );     //the place where the user dock goes
	profile.content   = $( '#profile-content' );
	profile.headerbar = $( '#profile-headerbar' );
	profile.input     = $( '#profile-input' );
	profile.viewer    = $( '#profile-viewer' );
	profile.socket    = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/mail' );
	profile.history   = window.History;

	profile.history.Adapter.bind( window, 'statechange', function(){
		var historyState = profile.history.getState();
		if( historyState.data.view === 'convos' ){
			profile.socket.emit( 'virtual disconnect' ); 
			profile.viewer.load( '/profile/delta/', function(){ delta.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
		} else if( historyState.data.view === 'badges' ){
			profile.socket.emit( 'virtual disconnect' );
			profile.viewer.load( '/profile/badges/', function(){ badges.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
		} else if( historyState.data.view === 'mail' ){
			profile.socket.emit( 'virtual disconnect' );
			profile.viewer.load( '/profile/mail/', function(){ mail.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
		} else if( historyState.data.view === 'options' ){
			options.init();
		} else if( historyState.data.view === 'mailConvo' ){
			mail_convo.init( historyState.data.convo );
		} else if( historyState.data.view === 'convo' ){
			convo.init( historyState.data.convo );	
		}
	});

	profile.socket.on( 'message', function( data ){
		profile.socket.emit( 'clear new', data.to );
		mail_convo.add( data );
	});

	window.onresize = function( event ){
		profile.resize();
	};

	profile.resize = function(){
		profile.content.css( { 'height': $( window ).height() - ( profile.dock.outerHeight() + 10 ) } ) 
		profile.viewer.css( { 'height': $( window ).height() - ( profile.dock.outerHeight() + 17 + profile.headerbar.outerHeight() + profile.input.outerHeight() ) } )
	};

	$( '.profile-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.7 );
		}
	);
	$( '.profile-faded' ).click( function(){
		$( '.profile-faded' ).css( 'background-color', '#0B5FA5' );
		$( this ).css( 'background-color', '#FF4C00' );
	});

	$( '#profile-headerbar-tabs-delta'   ).click( function(){ profile.history.pushState( { view: 'convos'  }, 'conversations', 'convos'  ); } );
	$( '#profile-headerbar-tabs-badges'  ).click( function(){ profile.history.pushState( { view: 'badges'  }, 'badges',        'badges'  ); } );
	$( '#profile-headerbar-tabs-mail'    ).click( function(){ profile.history.pushState( { view: 'mail'    }, 'mail',          'mail'    ); } );
	$( '#profile-headerbar-tabs-options' ).click( function(){ profile.history.pushState( { view: 'options' }, 'options',       'options' ); } );
	//==========================================================================
	// Initialization
	//==========================================================================
	profile.resize();

	profile.unhideTab( 'delta' );
	profile.unhideTab( 'badges' );

	$.get( '/isLogged', function( user ){
		if( user ){
			profile.dock.load( '/modules/dock/auth' );
			profile.unhideTab( 'mail' );
			if( user.username === $( '#profile-headerbar-name-table-cell' ).html() ){
				profile.unhideTab( 'options' );
			}
		} else {
			profile.dock.load( '/modules/dock/' );
		}

		if( $( '#profile-meta-view' ).val() === 'badges' ){
			profile.viewer.load( '/profile/badges/', function(){ badges.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
			$( '#profile-headerbar-tabs-badges' ).css( 'background-color', '#FF4C00' );
		} else if( $( '#profile-meta-view' ).val() === 'mail' ){
			profile.viewer.load( '/profile/mail/', function(){ mail.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
			$( '#profile-headerbar-tabs-mail' ).css( 'background-color', '#FF4C00' );
		} else if( $( '#profile-meta-view' ).val() === 'options' ){
			profile.viewer.load( '/profile/options/', function(){ options.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
			$( '#profile-headerbar-tabs-options' ).css( 'background-color', '#FF4C00' );
		} else if( $( '#profile-meta-view' ).val() === 'convo' ){
			profile.viewer.load( '/modules/convo/', function(){ convo.init( JSON.parse( $( '#profile-meta-convo' ).val() ) ); } );
			$( '#profile-headerbar-tabs-delta' ).css( 'background-color', '#FF4C00' );
		} else if( $( '#profile-meta-view' ).val() === 'mailConvo' ){
			profile.viewer.load( '/modules/mail_convo/', function(){ mail_convo.init( JSON.parse( $( '#profile-meta-convo' ).val() ) ); } );
			$( '#profile-headerbar-tabs-mail' ).css( 'background-color', '#FF4C00' );
		} else {
			profile.viewer.load( '/profile/delta/', function(){ delta.init( $( '#profile-headerbar-name-table-cell' ).html() ); } );
			$( '#profile-headerbar-tabs-delta' ).css( 'background-color', '#FF4C00' );
		};
	});
}
