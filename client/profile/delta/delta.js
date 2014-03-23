var delta = $( '#delta'  );

delta.init = function() {
	for( var i=0; i < 15; i++ ) {
		$( '#delta-content' ).append( '<div id="delta-content' + i + '" class="delta-content"></div>' );
		$( '#delta-content' + i ).load( '/modules/convols/' );
	}
	
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
