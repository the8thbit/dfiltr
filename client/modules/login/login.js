var dock = $( '#dock' );

$( '.dock-faded' ).fadeTo( 0, 0.6 );

$( '.dock-faded' ).hover( 
	function() { //hover enter
		$( this ).fadeTo( 0 , 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 0 , 0.6 );
	}
)

$( '#dock-login-r' ).hover(
	function() { //hover enter
		$( '#dock-login-r' ).css( 'color', '#FF4C00' );
	}, function() { //hover exit
		$( '#dock-login-r' ).css( 'color', '#0B5FA5' );
	}
)

dock.init = function() {
	dock.fadeTo( 0 , 0.0 );
	dock.css( 'visibility', 'visible' );
	dock.fadeTo( 5 , 1.0 );
}
