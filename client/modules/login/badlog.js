var badlog  = $( '#badlog' );
badlog.dock = $( '#dock' );

window.onload = function() {
	$( '#dock' ).load( '/modules/dock/' );
	//chat.dock.load( '/modules/dock/auth',   function() { dock.init(); } );
}
