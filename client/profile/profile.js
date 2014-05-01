var profile = $( '#profile' );
profile.socket = io.connect( 'http://' + CLIENT_IP + ':' + CLIENT_PORT + '/mail' );
profile.username;

profile.resize = function(){
	$( '#profile-content' ).css( { 'height': $( window ).height() - ( $( '#profile-dock' ).outerHeight() + 10 ) } ) 
	$( '#profile-viewer' ).css( { 'height': $( window ).height() - ( $( '#profile-dock' ).outerHeight() + 17 + $( '#profile-headerbar' ).outerHeight() + $( '#profile-input' ).outerHeight() ) } )
};

profile.removeInput = function(){
	$( '#profile-input' ).html( '' );
	profile.resize();
	profile.socket.emit( 'virtual disconnect' ); 
}

profile.unhideTab = function( tabName ){
	$( '#profile-headerbar-tabs-'+tabName ).css( 'display', 'table-cell' );
	$( '#profile-headerbar-tabs-'+tabName ).fadeTo( 0, 0.6 );
};

profile.selectTab = function( tabName ){
	$( '#profile-headerbar-tabs-'+tabName ).css( 'background-color', '#FF4C00' );
}

profile.loadReqView = function(){
	if( $( '#profile-meta-view' ).val() === 'badges' ){
		$( '#profile-viewer' ).load( '/profile/badges/',         function(){ badges.init(    profile.username ); } );
		profile.selectTab( 'badges' );
	} else if( $( '#profile-meta-view' ).val() === 'mail' ){
		$( '#profile-viewer' ).load( '/profile/mail/',           function(){ mail.init(      profile.username ); } );
		profile.selectTab( 'mail' );
	} else if( $( '#profile-meta-view' ).val() === 'options' ){
		$( '#profile-viewer' ).load( '/profile/options/',        function(){ options.init(   profile.username ); } );
		profile.selectTab( 'options' );
	} else if( $( '#profile-meta-view' ).val() === 'convo' ){
		$( '#profile-viewer' ).load( '/profile/convos/convo/',   function(){ convo.init(     JSON.parse( $( '#profile-meta-convo'    ).val()) ); } );
		profile.selectTab( 'convos' );
	} else if( $( '#profile-meta-view' ).val() === 'mailConvo' ){
		$( '#profile-viewer' ).load( '/profile/mail/mailConvo/', function(){ mailConvo.init( JSON.parse( $( '#profile-meta-convo'    ).val()) ); } );
		profile.selectTab( 'mail' );
	} else { //loading the convos tab is the default state
		$( '#profile-viewer' ).load( '/profile/convos/',         function(){ convos.init(    profile.username ); } );
		profile.selectTab( 'convos' );
	};
}

//--------------------------------------------------------------------------
// events
//--------------------------------------------------------------------------
profile.createResizeEvent = function(){
	profile.resize();
	window.onresize = function( event ){ profile.resize(); }
}

profile.createMessageEvent = function(){
	profile.socket.on( 'message', function( data ){
		profile.socket.emit( 'clear new', data.to );
		mailConvo.addMessage( data );
	});
}

profile.createHoverFadeEvent = function(){
	$( '.profile-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.7 );
		}
	);
}

profile.createClickSelectEvent = function(){
	$( '.profile-faded' ).click( function(){
		$( '.profile-faded' ).css( 'background-color', '#0B5FA5' );
		$( this ).css( 'background-color', '#FF4C00' );
	});
}

profile.createStateChangeEvent = function(){
	profile.history.Adapter.bind( window, 'statechange', function(){
		var historyState = profile.history.getState();
		if( historyState.data.view === 'convos' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/convos/',        function(){ convos.init( profile.username ); } );
		} else if( historyState.data.view === 'badges' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/badges/',        function(){ badges.init( profile.username ); } );
		} else if( historyState.data.view === 'mail' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/mail/',          function(){ mail.init( profile.username ); } );
		} else if( historyState.data.view === 'options' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/options/',       function(){ options.init(); } );
		} else if( historyState.data.view === 'mailConvo' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/mail/mailConvo', function(){ mailConvo.init( historyState.data.convo ); } );
		} else if( historyState.data.view === 'convo' ){
			profile.removeInput();
			$( '#profile-viewer' ).load( '/profile/convos/convo',   function(){ convo.init( historyState.data.convo ); } );	
		}
	});
}

profile.createNewStateEvent = function(){
	$( '#profile-headerbar-tabs-convos'  ).click( function(){ profile.history.pushState( { view: 'convos'  }, 'conversations', '/user/'+profile.username+'/convos'  ); } );
	$( '#profile-headerbar-tabs-badges'  ).click( function(){ profile.history.pushState( { view: 'badges'  }, 'badges',        '/user/'+profile.username+'/badges'  ); } );
	$( '#profile-headerbar-tabs-mail'    ).click( function(){ profile.history.pushState( { view: 'mail'    }, 'mail',          '/user/'+profile.username+'/mail'    ); } );
	$( '#profile-headerbar-tabs-options' ).click( function(){ profile.history.pushState( { view: 'options' }, 'options',       '/user/'+profile.username+'/options' ); } );
}

profile.createEvents = function(){
	profile.createResizeEvent();
	profile.createMessageEvent();
	profile.createHoverFadeEvent();
	profile.createClickSelectEvent();
	profile.createStateChangeEvent();
	profile.createNewStateEvent();
}

//--------------------------------------------------------------------------
// initialization
//--------------------------------------------------------------------------
window.onload = function(){
	profile.history   = window.History;
	profile.username  = $( '#profile-headerbar-name-table-cell' ).html();

	profile.createEvents();
	profile.loadReqView();

	profile.unhideTab( 'convos' );
	profile.unhideTab( 'badges' );

	$.get( '/isLogged', function( user ){
		if( user ){
			$( '#profile-dock' ).load( '/modules/dock/auth' );
			profile.unhideTab( 'mail' );
			if( user.username === profile.username ){
				profile.unhideTab( 'options' );
			}
		} else {
			$( '#profile-dock' ).load( '/modules/dock/' );
		}
	});
}
