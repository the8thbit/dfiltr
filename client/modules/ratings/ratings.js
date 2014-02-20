var ratings = new Object();
ratings.defaultHTML = $( '#mod-ratings-head' ).html();
ratings.delta = new Object();
ratings.same  = new Object();
ratings.flag  = new Object();
ratings.delta.onHover = 'Delta: Your partner convinced you to change your view.'
ratings.delta.onClick = 'Great! We\'ll try to pair you with other people who are likely to change your views as well.'
ratings.same.onHover  = 'Congruence: You and your partner began the discussion with the same view.'
ratings.same.onClick  = 'Thanks. We\'ll try and get pair you with someone a little more different next time.'
ratings.flag.onHover  = 'Flag: Your partner was a spammer or some other type of malicious user.'
ratings.flag.onClick  = 'Spammers? On <i>my</i> chat? It\'s more likely than you think.'

ratings.stabalizeHTML = function( html ) {
	$( '#mod-ratings-head' ).html( html );
	ratings.defaultHTML   = html;
	ratings.delta.onHover = html;
	ratings.delta.onClick = html;
	ratings.same.onHover  = html;
	ratings.same.onClick  = html;
	ratings.flag.onHover  = html;
	ratings.flag.onClick  = html;
}

ratings.init = function() {
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

$( '#mod-ratings-buttons' ).hover( function() {}, function() {
	$( '#mod-ratings-head' ).html( ratings.defaultHTML );
})

$( '#mod-ratings-delta' ).hover( function() {
	$( '#mod-ratings-head' ).html( ratings.delta.onHover );
})

$( '#mod-ratings-same' ).hover( function() {
	$( '#mod-ratings-head' ).html( ratings.same.onHover );
})

$( '#mod-ratings-flag' ).hover( function() {
	$( '#mod-ratings-head' ).html( ratings.flag.onHover );
})

$( '.mod-ratings-button' ).on( 'click', function() {
	$( '#mod-ratings-buttons' ).prop( 'disabled', true );
	$( '#mod-ratings-buttons' ).fadeTo( 'slow' , 0, function() {
		$( '#mod-ratings-buttons' ).hide();
	});
})

$( '#mod-ratings-delta' ).on( 'click', function() {
	ratings.stabalizeHTML( ratings.delta.onClick );
})

$( '#mod-ratings-same' ).on( 'click', function() {
	ratings.stabalizeHTML( ratings.same.onClick );
})

$( '#mod-ratings-flag' ).on( 'click', function() {
	ratings.stabalizeHTML( ratings.flag.onClick );
})
