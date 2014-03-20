var process = 'CLIENT'; //necessary hacky code for the unified config file to work
document.write( '<script type="text/javascript" src="../../config.js"><\/script>' )

window.onload = function() {
	var profile      = $( '#profile' )
	profile.dock     = $( '#profile-dock' )     //the place where the user dock goes
	profile.content  = $( '#profile-content' )

	profile.content.css( { 'height': $( window ).height() - ( profile.dock.outerHeight() + 5 * 2 ) } )

	//==========================================================================
	// Initialization
	//==========================================================================
	$.get( '/isLogged', function( res ) {
		if( res ) {
			profile.dock.load( '/modules/dock/auth' );
		} else {
			profile.dock.load( '/modules/dock/' );
		}
	});
}
