var mailListElm = $( '.mailListElm' );

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
mailListElm.createHoverFadeEvent = function(){
	$( '.mailListElm-faded' ).fadeTo( 0, 0.6 );
	$( '.mailListElm-faded' ).hover( function(){
		$( this ).fadeTo( 0 , 1.0 );
	}, function() {
		$( this ).fadeTo( 0 , 0.6 );
	});
}

mailListElm.createEvents = function(){
	mailListElm.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initializaiton
//-----------------------------------------------------------------------------
mailListElm.init = function(){
	mailListElm.createEvents();
};
