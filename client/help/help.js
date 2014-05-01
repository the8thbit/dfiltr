var help = $( '#help' );

help.resize = function(){
	$( '#help-content' ).css( { 'height': $( window ).height() - ( $( '#help-dock' ).outerHeight() + 10 ) } ) 
	$( '#help-viewer' ).css( { 'height': $( window ).height() - ( $( '#help-dock' ).outerHeight() + 17 ) } )
};

//--------------------------------------------------------------------------
// events
//--------------------------------------------------------------------------
help.createResizeEvent = function(){
	help.resize();
	window.onresize = function( event ){ help.resize(); }
}

help.createEvents = function(){
	help.createResizeEvent();
}

//--------------------------------------------------------------------------
// initialization
//--------------------------------------------------------------------------
window.onload = function(){
	$.get( '/isLogged', function( user ){
		if( user ){
			$( '#help-dock' ).load( '/modules/dock/auth' );
		} else {
			$( '#help-dock' ).load( '/modules/dock/' );
		}
	});
}
