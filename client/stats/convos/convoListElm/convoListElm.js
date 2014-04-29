var convoListElm = $( '.convoListElm' );

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
convoListElm.createHoverFadeEvent = function(){
	$( '.convoListElm-faded' ).fadeTo( 0, 0.7 );
	$( '.convoListElm-faded' ).hover( function() {
			$( this ).fadeTo( 0 , 1.0 );
		}, function() {
			$( this ).fadeTo( 0 , 0.7 );
		}
	);
}

convoListElm.createEvents = function(){
	convoListElm.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
convoListElm.init = function() {
	convoListElm.createEvents();
}
