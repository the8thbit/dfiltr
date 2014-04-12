var delta = $( '#delta'  );

delta.init = function( username ) {
	$( '#profile-input' ).html( '' );
	profile.resize();
	$.get( '/modules/convols/', function( data ) {
		var template = data;

		$.get( '/mongo/profile/delta', { name: username }, function( data ) {
			$( '#delta-content' ).append(
				$.map( data, function( conversation, i ) {
					var target = $( '<div>', { id: 'delta-content' + i, class: 'delta-content' } ).html( template );
					target.find( '.convols-topic' ).html( conversation.topic );
					target.find( '.convols-deltas-blue' ).html( conversation.deltas[0] + ' ∆' );
					target.find( '.convols-deltas-red' ).html( conversation.deltas[1] + ' ∆' );

					//when the user clicks the topic title, load the conversation view page
					target.find( '.convols-topic' ).click( function() {
						$( '#delta' ).load( '/modules/convo/', function() {
							convo.init();
							$( '#convo-content' ).append( '<div class="convo-message convo-topic">' + conversation.topic + '</div>' );
							for( var i=0; i < conversation.messages.length; i++ ) {
								if( conversation.messages[i].userId == 0 ) {
									$( '#convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
								} else {
									$( '#convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
								}
							}
							$( '#convo-stats-blue-name span'  ).html( conversation.users[0] );
							$( '#convo-stats-red-name span'   ).html( conversation.users[1] );
							$( '#convo-stats-blue-score span' ).html( conversation.deltas[0] + ' ∆' );
							$( '#convo-stats-red-score span'  ).html( conversation.deltas[1] + ' ∆' );
						});
					});

					return target[0];
				})
			);
		});
	});
	
	delta.resize = function() {
		$( '#delta-content' ).css( { 'height' :  $( '#delta' ).height() - $( '#delta-options' ).height() - 6 } );
	}

	setInterval( function() {
		delta.resize();
	}, 100 );
	
	$( '#delta' ).onresize = function( event ) {
		delta.resize();
	}
	delta.resize();
}
