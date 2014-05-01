$( document ).ready( function() {
	$.get( '/isLogged', function( user ) { 
		$( '#dock-username' ).html( '<a href="/user/' + user.username + '" class="dock-faded">' + user.username + '</a>' );
		$( '#dock-stats-deltas' ).html( '<a href="/user/' + user.username + '">' + user.deltas + ' ∆ &nbsp&nbsp</a> ' );
		$( '.dock-faded' ).fadeTo( 0, 0.6 );

		$( '.dock-faded' ).hover(
			function() { //hover enter
				$( this ).fadeTo( 0 , 1.0 );
			}, function() { //hover exit
				$( this ).fadeTo( 0 , 0.6 );
			}
		);	
	});

	var dock = $( '#dock' );
	$( '.dock-faded' ).fadeTo( 0, 0.6 );
	dock.css( 'visibility', 'visible' );
	$( '#login' ).load( '/modules/login' );

	$( '#popup' ).colorbox( { 
		inline: true,
		transition: 'none'
	});

	$( '.dock-faded' ).hover(
		function() { //hover enter
			$( this ).fadeTo( 0 , 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 0 , 0.6 );
		}
	)	

	$( '#dock-login-r' ).hover(
		function() { //hover enter
			$( '#dock-login-r' ).css( 'color', '#FF4C00' );
		}, function() { //hover exit
			$( '#dock-login-r' ).css( 'color', '#0B5FA5' );
		}
	)
});
