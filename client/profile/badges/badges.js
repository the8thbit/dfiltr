var badges = $( '#badges'  );

badges.init = function() {
	for( var i=0; i < 300; i++ ) {
		var colorClass
		var colorId = Math.floor( Math.random() * 3 )
		if( colorId == 0 ) { colorClass = 'badges-easy' } else
		if( colorId == 1 ) { colorClass = 'badges-medium' } else
		if( colorId == 2 ) { colorClass = 'badges-hard' } else
		if( colorId == 3 ) { colorClass = 'badges-secret' }
		
		$( '#badges-list' ).append( '<div id="badges-list' + i + '" class="badges-badge ' + colorClass + '" >#</div>' );
	}
	$( '.badges-badge' ).fadeTo( 0, 0.7 );

	$( '#badges-list' ).isotope( {
		itemSelector: '.badges-badge',
		layoutMode: 'fitRows'
	});

	badges.resize = function() {
		$( '#badges-list' ).css( { 'height' :  $( '#badges' ).height() - $( '#badges-options' ).height() - $( '#badges-viewer' ).height() - 7 } );
	}

	$( '.badges-badge' ).click( function() {
		$( '#badges-viewer' ).css( 'height', '160px' );
		$( '#badges-viewer' ).css( 'border-bottom-width', '1px' );

		var difficulty;
		if( $( this ).hasClass( 'badges-easy'   ) ) { difficulty = 'easy'   } else
		if( $( this ).hasClass( 'badges-medium' ) ) { difficulty = 'medium' } else
		if( $( this ).hasClass( 'badges-hard'   ) ) { difficulty = 'hard'   } else
		if( $( this ).hasClass( 'badges-secret' ) ) { difficulty = 'secret' }

		$( '#badges-viewer' ).load( '/profile/badges/view/', function() { 
			view.init(
				'#',
				difficulty,
				'Test Badge',
				'acquired on 6/6/1966 at 12:13:37',
				'This is just a badge for testing out the badge display system. You can\'t get this badge through normal use of this site.'
			);
		});

		badges.resize();
	});

	$( '.badges-badge' ).hover(
		function() { //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 'fast', 0.7 );
		}
	);

	setInterval( function() {
		badges.resize();
	}, 100 );
	
	badges.resize();
}
