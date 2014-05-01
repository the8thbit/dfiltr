var convo = $( '#convo' );

convo.resize = function(){
	$( '#convo-content' ).css( { 'height' :  $( '#convo' ).height() - ( $( '#convo-stats' ).outerHeight() + $( '#convo-options' ).outerHeight() ) } );
}

convo.populateConvo = function( conversation ){
	$( '#convo-content' ).append( '<div class="convo-message convo-topic">' + conversation.topic + '</div>' );
	for( var i=0; i < conversation.messages.length; i++ ){
		if( conversation.messages[i].userId == 0 ){
			$( '#convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
		} else {
			$( '#convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
		}
	}
}

convo.populateStats = function( conversation ){
	if( conversation.users[0] ){ $( '#convo-stats-blue-name span'  ).html( '<a href="/user/'+conversation.users[0]+'/">'+conversation.users[0]+'</a>' ); }
	if( conversation.users[1] ){ $( '#convo-stats-red-name span'   ).html( '<a href="/user/'+conversation.users[1]+'/">'+conversation.users[1]+'</a>' ); }
	$( '#convo-stats-blue-score span' ).html( conversation.deltas[0] + ' ∆' );
	$( '#convo-stats-red-score span'  ).html( conversation.deltas[1] + ' ∆' );
}

convo.populate = function( conversation ){
	convo.populateConvo( conversation );
	convo.populateStats( conversation );
}

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
convo.createResizeEvent = function(){
	convo.resize();
	setInterval( function(){
		convo.resize();
	}, 100 );
}

convo.createHoverFadeEvent = function(){
	$( '.convo-faded' ).fadeTo( 0, 0.6 );
	$( '.convo-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

convo.createEvents = function(){
	convo.createResizeEvent();
	convo.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
convo.init = function( conversation ){
	$( '#convo-options-blue-rating' ).click( function(){
		$( '#convo-options-blue-rating' ).fadeTo( 'fast', 0, function(){
			$( '#convo-options-blue-rating' ).css( 'visibility', 'none' );
		})
		$( '#convo-options-blue-rating' ).unbind( 'click mouseenter mouseleave' );
		$( '#convo-options-blue-rating' ).css( 'cursor', 'default' );
		conversation.deltas[0] += 1;
		conversation.deltas[2] += 1;
		convo.populateStats( conversation );
		$.post( '/giveDelta', { convo: conversation._id, color: 'blue' } );
	});

	$( '#convo-options-red-rating' ).click( function(){
		$( '#convo-options-red-rating' ).fadeTo( 'fast', 0, function(){
			$( '#convo-options-red-rating' ).css( 'visibility', 'none' );
		})
		$( '#convo-options-red-rating' ).unbind( 'click mouseenter mouseleave' );
		$( '#convo-options-red-rating' ).css( 'cursor', 'default' );
		conversation.deltas[1] += 1;
		conversation.deltas[2] += 1;
		convo.populateStats( conversation );
		$.post( '/giveDelta', { convo: conversation._id, color: 'red' } );
	});

	convo.populate( conversation );
	convo.createEvents();
}
