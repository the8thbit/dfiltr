var delta = $( '#delta'  );

delta.init = function( username ) {
	$.get( '/modules/convols/', function( data ) {
		var template = data;

		$.get( '/mongo/profile/delta', { name: username }, function( data ) {
			$( '#delta-content' ).append(
				$.map( data, function( convo, i ) {
					var target = $( '<div>', { id: 'delta-content' + i, class: 'delta-content' } ).html( template );
					target.find( '.convols-topic' ).html( convo.topic );
					target.find( '.convols-topic' ).click( function() {
						$( '#delta-content' ).load( '/modules/convo/', function() {
							convoinit();
							$( '#convo-content' ).append( '<div class="convo-message convo-topic">' + convo.topic + '</div>' );
							for( var i=0; i < convo.messages.length; i++ ) {
								if( convo.messages[i].userId == 0 ) {
									$( '#convo-content' ).append( '<div class="convo-message convo-blue">' + convo.messages[i].message + '</div>' );
								} else {
									$( '#convo-content' ).append( '<div class="convo-message convo-red">'  + convo.messages[i].message + '</div>' );
								}
							}
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
