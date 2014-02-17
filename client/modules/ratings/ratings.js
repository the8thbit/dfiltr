var modRatingsHeadHTML;

modRatingsInit = function() {
	modRatingsHeadHTML = $( '#mod-ratings-head' ).html();
	$( '#mod-ratings' ).hide();
	$( '#mod-ratings' ).css( 'visibility', 'visible' );				
	$( '#mod-ratings' ).fadeIn( 'slow' );
	$( '.mod-ratings-button' ).fadeTo( 0 , 0.7 );
}

$( '.mod-ratings-button' ).hover( 
	function() {
		$( this ).fadeTo( 'fast' , 1.0 );
	}, function() {
		$( this ).fadeTo( 'fast' , 0.7 );
	}
)

$( '#mod-ratings-delta' ).hover( 
	function() {
		$( '#mod-ratings-head' ).html( 'Delta: Your partner convinced you to change your view.' );
	}, function() {
		$( '#mod-ratings-head' ).html( modRatingsHeadHTML );
	}
)

$( '#mod-ratings-same' ).hover( 
	function() {
		$( '#mod-ratings-head' ).html( 'Congruence: You and your partner began the discussion with the same view.' );
	}, function() {
		$( '#mod-ratings-head' ).html( modRatingsHeadHTML );
	}
)

$( '#mod-ratings-flag' ).hover( 
	function() {
		$( '#mod-ratings-head' ).html( 'Flag: Your partner was a spammer or some other type of malicious user.' );
	}, function() {
		$( '#mod-ratings-head' ).html( modRatingsHeadHTML );
	}
)

$( '.mod-ratings-button' ).on( 'click', function() {
	$( '#mod-ratings-buttons' ).prop( 'disabled', true );
	$( '#mod-ratings-buttons' ).fadeTo( 'slow' , 0, function() {
		$( '#mod-ratings-buttons' ).hide();
	});
})

$( '#mod-ratings-delta' ).on( 'click', function() {
	$( '#mod-ratings-head' ).html( 'Great! We\'ll try to pair you with other people who are likely to change your views as well.' );
	modRatingsHeadHTML = $( '#mod-ratings-head' ).html();
})

$( '#mod-ratings-same' ).on( 'click', function() {
	$( '#mod-ratings-head' ).html( 'Thanks. We\'ll try and get pair you with someone a little more different next time.' );
	modRatingsHeadHTML = $( '#mod-ratings-head' ).html();
})

$( '#mod-ratings-flag' ).on( 'click', function() {
	$( '#mod-ratings-head' ).html( 'Spammers? On <i>my</i> chat? It\'s more likely than you think.' );
	modRatingsHeadHTML = $( '#mod-ratings-head' ).html();
})
