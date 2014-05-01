var userListElm = $( '.userListElm' );

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
userListElm.createHoverFadeEvent = function(){
	$( '.userListElm-faded' ).fadeTo( 0, 0.7 );
	$( '.userListElm-faded' ).hover( function() {
			$( this ).fadeTo( 0 , 1.0 );
		}, function() {
			$( this ).fadeTo( 0 , 0.7 );
		}
	);
}

userListElm.createEvents = function(){
	userListElm.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
userListElm.init = function() {
	userListElm.createEvents();
}
