var mail = $( '#mail'  );

mail.init = function( username ) {
	$.get( '/mongo/profile/delta', { name: username }, function( data ) {
		console.log( data );
		$( '#mail-content' ).append(
			$.map( data, function( conversation, i ) {
				var target = $( '<div>', { id: 'mail-content' + i, class: 'mail-content' } ).html( 'sdsadas' );
				return target[0];
			})
		);
	});
	
	mail.resize = function() {
		$( '#mail-content' ).css( { 'height' :  mail.height() - $( '#mail-options' ).height() - 6 } );
	}

	setInterval( function() {
		mail.resize();
	}, 100 );
	
	mail.resize();
}
