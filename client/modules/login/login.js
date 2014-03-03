$( '.login-submit' ).fadeTo( 0, 0.6 );

$( '.login-submit' ).hover( 
		function() { //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	)	

$( '#login-log' ).on( 'submit', function(event) { 
	event.preventDefault(); 
	$.post( '/login', $( this ).serialize( ) );
});

