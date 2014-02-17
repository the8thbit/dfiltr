modRatingsInit = function() {
	$( '#mod-ratings' ).hide();
	$( '#mod-ratings' ).css( 'visibility', 'visible' );				
	$( '#mod-ratings' ).fadeIn( 'slow' );
	$( '.mod-ratings-button' ).fadeTo( 0 , 0.7 );
}

$( '.mod-ratings-button' ).hover( function() {
		$( this ).fadeTo( 'fast' , 1.0 );
	}, function() {
		$( this ).fadeTo( 'fast' , 0.7 );
	}
)
