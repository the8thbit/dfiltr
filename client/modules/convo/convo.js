var convo = $( '#convo' );

$( '.convo-faded' ).fadeTo( 0, 0.6 );
$( '.convo-faded' ).hover(
	function() { //hover enter
		$( this ).fadeTo( 0, 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 0, 0.6 );
	}
);

