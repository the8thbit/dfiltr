$( '.dock-faded' ).fadeTo( 0, 0.7 );

$( '.dock-faded' ).hover( 
	function() { //hover enter
		$( this ).fadeTo( 'fast' , 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 'fast' , 0.7 );
	}
)

