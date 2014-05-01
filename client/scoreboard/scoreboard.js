var scoreboard = $( '#scoreboard' );

scoreboard.resize = function(){
	$( '#scoreboard-content' ).css( { 'height': $( window ).height() - ( $( '#scoreboard-dock' ).outerHeight() + 10 ) } ) 
	$( '#scoreboard-viewer' ).css( { 'height': $( window ).height() - ( $( '#scoreboard-dock' ).outerHeight() + 17 + $( '#scoreboard-headerbar' ).outerHeight() ) } )
};

scoreboard.selectTab = function( tabName ){
	$( '#scoreboard-headerbar-tabs-'+tabName ).css( 'background-color', '#FF4C00' );
}

scoreboard.loadReqView = function(){
	if( $( '#scoreboard-meta-view' ).val() === 'badges' ){
		$( '#scoreboard-viewer' ).load( '/scoreboard/badges',       function(){ badges.init(); } );
		scoreboard.selectTab( 'badges' );
	} else if( $( '#scoreboard-meta-view' ).val() === 'convo' ){
		$( '#scoreboard-viewer' ).load( '/scoreboard/convos/convo', function(){ convo.init( JSON.parse( $( '#scoreboard-meta-convo' ).val()) ); } );
		scoreboard.selectTab( 'convos' );
	} else if( $( '#scoreboard-meta-view' ).val() === 'convos' ){  //loading the convos tab is the default state
		$( '#scoreboard-viewer' ).load( '/scoreboard/convos',       function(){ convos.init(); } );
		scoreboard.selectTab( 'convos' );
	} else {
		$( '#scoreboard-viewer' ).load( '/scoreboard/users',       function(){ users.init(); } );
		scoreboard.selectTab( 'users' );
	}
}

//--------------------------------------------------------------------------
// events
//--------------------------------------------------------------------------
scoreboard.createResizeEvent = function(){
	scoreboard.resize();
	window.onresize = function( event ){ scoreboard.resize(); }
}

scoreboard.createHoverFadeEvent = function(){
	$( '.scoreboard-faded' ).fadeTo( 0, 0.6 );
	$( '.scoreboard-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

scoreboard.createClickSelectEvent = function(){
	$( '.scoreboard-faded' ).click( function(){
		$( '.scoreboard-faded' ).css( 'background-color', '#0B5FA5' );
		$( this ).css( 'background-color', '#FF4C00' );
	});
}

scoreboard.createStateChangeEvent = function(){
	scoreboard.history.Adapter.bind( window, 'statechange', function(){
		var historyState = scoreboard.history.getState();
		if( historyState.data.view === 'users' ){
			$( '#scoreboard-viewer' ).load( '/scoreboard/users/',         function(){ users.init(); } );
		} else if( historyState.data.view === 'convos' ){
			$( '#scoreboard-viewer' ).load( '/scoreboard/convos/',        function(){ convos.init(); } );
		} else if( historyState.data.view === 'badges' ){
			$( '#scoreboard-viewer' ).load( '/scoreboard/badges/',        function(){ badges.init(); } );
		} else if( historyState.data.view === 'convo' ){
			$( '#scoreboard-viewer' ).load( '/scoreboard/convos/convo',   function(){ convo.init( historyState.data.convo ); } );	
		}
	});
}

scoreboard.createNewStateEvent = function(){
	$( '#scoreboard-headerbar-tabs-users'   ).click( function(){ scoreboard.history.pushState( { view: 'users'  },  'dfiltr.com - popping filter bubbles', '/stats/users'    ); } );
	$( '#scoreboard-headerbar-tabs-convos'  ).click( function(){ scoreboard.history.pushState( { view: 'convos'  }, 'dfiltr.com - popping filter bubbles', '/stats/convos'   ); } );
	$( '#scoreboard-headerbar-tabs-badges'  ).click( function(){ scoreboard.history.pushState( { view: 'badges'  }, 'dfiltr.com - popping filter bubbles', '/stats/badges'   ); } );
}

scoreboard.createEvents = function(){
	scoreboard.createResizeEvent();
	scoreboard.createHoverFadeEvent();
	scoreboard.createClickSelectEvent();
	scoreboard.createStateChangeEvent();
	scoreboard.createNewStateEvent();
}

//--------------------------------------------------------------------------
// initialization
//--------------------------------------------------------------------------
window.onload = function(){
	scoreboard.history = window.History;

	scoreboard.createEvents();
	scoreboard.loadReqView();

	$.get( '/isLogged', function( user ){
		if( user ){
			$( '#scoreboard-dock' ).load( '/modules/dock/auth' );
		} else {
			$( '#scoreboard-dock' ).load( '/modules/dock/' );
		}
	});
}
