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

convo.init = function( conversation ) {
	$( '#profile-viewer' ).load( '/modules/convo/', function() {
		$( '#convo-content' ).append( '<div class="convo-message convo-topic">' + conversation.topic + '</div>' );
		for( var i=0; i < conversation.messages.length; i++ ) {
			if( conversation.messages[i].userId == 0 ) {
				$( '#convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
			} else {
				$( '#convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
			}
		}
		$( '#convo-stats-blue-name span'  ).html( '<a href="/user/'+conversation.users[0]+'/">'+conversation.users[0]+'</a>' );
		$( '#convo-stats-red-name span'   ).html( '<a href="/user/'+conversation.users[1]+'/">'+conversation.users[1]+'</a>' );
		$( '#convo-stats-blue-score span' ).html( conversation.deltas[0] + ' ∆' );
		$( '#convo-stats-red-score span'  ).html( conversation.deltas[1] + ' ∆' );
	});

	setInterval( function() {
		convo.resize();
	}, 100 );
	
	convo.resize();
}
