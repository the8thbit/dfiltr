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
	$( '#convo-content' ).css( { 'height' :  $( '#convo' ).height() - ( $( '#convo-stats' ).outerHeight() + $( '#convo-options' ).outerHeight() ) } );
}

convo.init = function() {
	setInterval( function() {
		convo.resize();
	}, 100 );
	
	convo.resize();
}
