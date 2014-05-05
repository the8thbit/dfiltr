var convo = $( '#convo' );

convo.resize = function(){
	$( '#convo-content' ).css( { 'height' :  $( '#convo' ).height() - ( $( '#convo-stats' ).outerHeight() + $( '#convo-options' ).outerHeight() ) } );
}

convo.unhideRatings = function(){
	$.get( '/isLogged', function( user ){
		var hideBlue = false;
		var hideRed  = false;
		if( user ){
			for( var i=0; i < convo.content.blueDeltas.length; i+=1 ){
				if( convo.content.blueDeltas[i] === user.username ){
					hideBlue = true;
					break;
				}
			}
			for( var i=0; i < convo.content.redDeltas.length; i+=1 ){
				if( convo.content.redDeltas[i] === user.username ){
					hideRed = true;
					break;
				}
			}
			if( !hideBlue ){ $( '#convo-options-blue-rating' ).css( 'visibility', 'visible' ); }
			if( !hideRed  ){ $( '#convo-options-red-rating'  ).css( 'visibility', 'visible' ); }			
		}
	});
}

convo.populateConvo = function(){
	$( '#convo-content' ).append( '<div class="convo-message convo-topic">' + convo.content.topic + '</div>' );
	for( var i=0; i < convo.content.messages.length; i++ ){
		if( convo.content.messages[i].userId == 0 ){
			$( '#convo-content' ).append( '<div class="convo-message convo-blue">' + convo.content.messages[i].message + '</div>' );
		} else {
			$( '#convo-content' ).append( '<div class="convo-message convo-red">'  + convo.content.messages[i].message + '</div>' );
		}
	}
}

convo.populateStats = function(){
	if( convo.content.users[0] ){ $( '#convo-stats-blue-name span'  ).html( '<a href="/user/'+convo.content.users[0]+'/">'+convo.content.users[0]+'</a>' ); }
	if( convo.content.users[1] ){ $( '#convo-stats-red-name span'   ).html( '<a href="/user/'+convo.content.users[1]+'/">'+convo.content.users[1]+'</a>' ); }
	$( '#convo-stats-blue-score span' ).html( convo.content.deltas[0] + ' ∆' );
	$( '#convo-stats-red-score span'  ).html( convo.content.deltas[1] + ' ∆' );
}

convo.populate = function(){
	convo.populateConvo();
	convo.populateStats();
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

convo.createRateEvent = function( color ){
	$( '#convo-options-'+color+'-rating' ).click( function(){
		$( '#convo-options-'+color+'-rating' ).fadeTo( 'fast', 0, function(){
			$( '#convo-options-'+color+'-rating' ).css( 'visibility', 'hidden' );
		})
		$( '#convo-options-'+color+'-rating' ).unbind( 'click mouseenter mouseleave' );
		$( '#convo-options-'+color+'-rating' ).css( 'cursor', 'default' );
		if( color === 'blue' ){
			convo.content.deltas[0] += 1;
		} else if( color === 'red' ){
			convo.content.deltas[1] += 1;
		}
		convo.content.deltas[2] += 1;
		convo.populateStats( convo.content );
		$.post( '/giveDelta', { convo: convo.content._id, color: color } );
	});
}

convo.createEvents = function(){
	convo.createRateEvent( 'blue' );
	convo.createRateEvent( 'red' );
	convo.createResizeEvent();
	convo.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
convo.init = function( content ){
	convo.content = content;
	convo.unhideRatings();
	convo.populate();
	convo.createEvents();
}
