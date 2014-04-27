var convols = $( '.convols' );

convols.init = function() {
	$( '.convols-faded' ).fadeTo( 0, 0.7 );
	$( '.convols-faded' ).hover( function() {
			$( this ).fadeTo( 0 , 1.0 );
		}, function() {
			$( this ).fadeTo( 0 , 0.7 );
		}
	);
}
