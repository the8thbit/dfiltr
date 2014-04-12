var mail_convo = $( '#mail_convo' );
mail_convo.content = $( '#mail_convo-content' );

$( '.mail_convo-faded' ).fadeTo( 0, 0.6 );
$( '.mail_convo-faded' ).hover(
	function() { //hover enter
		$( this ).fadeTo( 0, 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 0, 0.6 );
	}
);

mail_convo.add = function( data ) {
	if( data && data.message && data.message != '' && data.type ) {
		if( data.type == 'partner' ) { var text = '<div class="mail_convo-message mail_convo-red">'  + data.message + '</span>'; } else
		if( data.type == 'self'    ) { var text = '<div class="mail_convo-message mail_convo-blue">' + data.message + '</span>'; }
		console.log( text )
		$( '#mail_convo-content' ).append( text );
		$( '#mail_convo-content' ).scrollTop( 99999999 );
	};
};

mail_convo.resize = function() {
	$( '#mail_convo-content' ).css( { 'height' :  $( '#mail_convo' ).height() - ( $( '#mail_convo-name' ).outerHeight() ) } );
}

mail_convo.init = function() {
	$( '#profile-input' ).load( '/modules/mail_input/', function() {
		profile.resize();
		mail_input.init();
	});

	setInterval( function() {
		mail_convo.resize();
	}, 100 );
	
	mail_convo.resize();
}
