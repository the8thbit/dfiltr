var convo = $( '#convo' );

$( '.convo-faded' ).fadeTo( 0, 0.6 );
$( '.convo-faded' ).hover(
	function() { //hover enter
		$( this ).fadeTo( 0, 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 0, 0.6 );
	}
);

convo.resize = function() {
	$( '#convo-content' ).css( { 'height' :  $( '#convo' ).height() - $( '#convo-stats' ).outerHeight() } );
}

convoinit = function() {
	setInterval( function() {
		$( '#convo-content' ).css( { 'height' :  $( '#convo' ).height() - $( '#convo-stats' ).outerHeight() } );
	}, 100 );
	
	convo.resize();
}
