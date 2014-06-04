var splash = $( '#splash' );

splash.resize = function(){
	$( '#splash-viewer' ).css( { 'height': $( window ).height() - ( $( '#splash-dock' ).outerHeight() + 12 ) } )
}

splash.selectTab = function( tabName ){
	$( '#splash-headerbar-tabs-'+tabName ).css( 'background-color', '#FF4C00' );
}

splash.authorize = function(){
	$.get( '/isLogged', function( user ){
		if( user ){
			$( '#splash-dock' ).load( '/modules/dock/auth' );
		} else {
			$( '#splash-dock' ).load( '/modules/dock/' );
		}
	});
}

//--------------------------------------------------------------------------
// events
//--------------------------------------------------------------------------
splash.createResizeEvent = function(){
	splash.resize();
	window.onresize = function( event ){ splash.resize(); }
}

splash.createHoverFadeEvent = function(){
	$( '.splash-faded' ).fadeTo( 0, 0.6 );
	$( '.splash-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

splash.createClickSelectEvent = function(){
	$( '#splash-options-tabs-random' ).css( 'background-color', '#FF4C00' );
	$( '.splash-faded' ).click( function(){
		$( '.splash-faded' ).css( 'background-color', '#0B5FA5' );
		$( this ).css( 'background-color', '#FF4C00' );
	});
	$( '#splash-options-tabs-random' ).click( function(){
		$( '#splash-options-actions' ).load( '/actions/random', function(){ random.init(); } );
	});
	$( '#splash-options-tabs-tags' ).click( function(){
		$( '#splash-options-actions' ).load( '/actions/tags', function(){ tags.init(); } );
	});
	$( '#splash-options-tabs-custom' ).click( function(){
		$( '#splash-options-actions' ).load( '/actions/custom', function(){ custom.init(); } );
	});
}

splash.createEvents = function(){
	splash.createResizeEvent();
	splash.createHoverFadeEvent();
	splash.createClickSelectEvent();
}

//--------------------------------------------------------------------------
// initialization
//--------------------------------------------------------------------------
window.onload = function(){
	splash.createEvents();
	splash.authorize();
	$( '#splash-options-actions' ).load( '/actions/random', function(){ random.init(); } );
}
