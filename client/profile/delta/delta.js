var delta = $( '#delta'  );

delta.init = function( username ) {
	$.get( '/modules/convols/', function(data) {
		var template = data;

		$.get( '/mongo/profile/delta', { name: username }, function( data ) {
			$( '#delta-content' ).append(
				$.map( data, function( delta, i ) {
					var target = $( '<div>', { id: 'delta-content' + i, class: 'delta-content' } ).html(template);
					target.find( '.convols-topic' ).html(delta.topic);
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
