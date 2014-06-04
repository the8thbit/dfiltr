var random = $( '#splash-random'  );

random.createHoverFadeEvent = function(){
	$( '.splash-random-faded' ).fadeTo( 0, 0.6 );
	$( '.splash-random-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

random.createEvents = function(){
	random.createHoverFadeEvent();
}

random.init = function(){
	random.createEvents();
	random.css( 'visibility', 'visible' );
}
