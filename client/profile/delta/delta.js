var delta = $( '#delta'  );

delta.init = function( username ) {
	$.get( '/mongo/profile/delta', { name: username }, function( res ) {
		var cb_i = 0;
		for( var i=0; i < res.length; i++ ) {
			$( '#delta-content' ).append( '<div id="delta-content' + i + '" class="delta-content"></div>' );
			$( '#delta-content' + i ).load( '/modules/convols/', function() {
				$( '#delta-content' + cb_i ).find( '.convols-topic' ).html( res[cb_i].topic );
				cb_i++;
			});
		}
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
