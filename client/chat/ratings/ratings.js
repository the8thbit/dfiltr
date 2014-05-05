var ratings = $( '#mod-ratings' );

ratings.head    = $( '#mod-ratings-head' );
ratings.buttons = $( '#mod-ratings-buttons' );
ratings.button  = $( '.mod-ratings-button' );
ratings.delta   = $( '#mod-ratings-delta' );
ratings.same    = $( '#mod-ratings-same' );
ratings.flag    = $( '#mod-ratings-flag' );

ratings.defaultHTML = $( '#mod-ratings-head' ).html();
ratings.delta.onHover = 'Delta: Your partner convinced you to change your view.'
ratings.delta.onClick = 'Great! We\'ll try to pair you with other people who are likely to change your views as well.'
ratings.same.onHover  = 'Congruence: You and your partner began the discussion with the same view.'
ratings.same.onClick  = 'Thanks. We\'ll try and get pair you with someone a little more different next time.'
ratings.flag.onHover  = 'Flag: Your partner was a spammer or some other type of malicious user.'
ratings.flag.onClick  = 'Spammers? On <i>my</i> chat? It\'s more likely than you think.'

//=============================================================================
// stabalizeHTML: makes the header stay as one message regardless of events
//=============================================================================
ratings.stabalizeHTML = function( html ) {
	this.head.html( html );
	this.defaultHTML   = html;
	this.delta.onHover = html;
	this.delta.onClick = html;
	this.same.onHover  = html;
	this.same.onClick  = html;
	this.flag.onHover  = html;
	this.flag.onClick  = html;
}

ratings.init = function( socket ) {
	this.socket = socket
	this.hide();
	this.css( 'visibility', 'visible' );				
	this.fadeIn( 'slow' );
	this.button.fadeTo( 0 , 0.7 );
}

//fade buttons in when we hover over them
ratings.button.hover( 
	function() { //hover enter
		$( this ).fadeTo( 'fast' , 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 'fast' , 0.7 );
	}
)

//change header text when we hover over a button
ratings.delta.hover( function() { ratings.head.html( ratings.delta.onHover ); } )
ratings.same.hover(  function() { ratings.head.html( ratings.same.onHover );  } )
ratings.flag.hover(  function() { ratings.head.html( ratings.flag.onHover );  } )

//set the header back to default when user has moves mouse away from buttons
ratings.buttons.hover( function() {}, function() { //hover exit
	ratings.head.html( ratings.defaultHTML );
})

//remove buttons when one is clicked
ratings.button.on( 'click', function() {
	ratings.buttons.prop( 'disabled', true );
	ratings.buttons.fadeTo( 'slow' , 0, function() {
		ratings.buttons.hide();
	});
})

ratings.delta.on( 'click', function() {
	ratings.socket.emit( 'rate', { rating: 'delta' } )
	ratings.stabalizeHTML( ratings.delta.onClick );
})

ratings.same.on( 'click', function() {
	ratings.socket.emit( 'rate', { rating: 'same' } )
	ratings.stabalizeHTML( ratings.same.onClick );
})

ratings.same.on( 'click', function() {
	ratings.socket.emit( 'rate', { rating: 'flag' } )
	ratings.stabalizeHTML( ratings.flag.onClick );
})
