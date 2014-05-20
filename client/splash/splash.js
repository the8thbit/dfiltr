var splash = $( '#splash' );

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

splash.createEvents = function(){ splash.createHoverFadeEvent(); }

//--------------------------------------------------------------------------
// initialization
//--------------------------------------------------------------------------
window.onload = function(){
	splash.createEvents();
	splash.authorize();
}
