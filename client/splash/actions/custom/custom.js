var custom = $( '#splash-custom' );

custom.createHoverFadeEvent = function(){
	$( '.splash-custom-faded' ).fadeTo( 0, 0.6 );
	$( '.splash-custom-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

custom.createEvents = function(){
	custom.createHoverFadeEvent();
}

custom.init = function(){
	custom.createEvents();
	custom.css( 'visibility', 'visible' );
	$( '#splash-custom-input' ).focus();
}
