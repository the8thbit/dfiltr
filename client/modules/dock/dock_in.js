var dock = $( '#dock' );

dock.getMail = function(){
	$.get( '/isLogged', function( user ) { 
		$( '#dock-username' ).html( '<a href="/user/' + user.username + '" class="dock-faded">' + user.username + '</a>' );
		$( '#dock-stats-deltas' ).html( '<a href="/user/' + user.username + '/convos">' + user.deltas + ' ∆ &nbsp&nbsp</a> ' );
		$( '#dock-stats-mail a' ).css( 'color', 'blue' );
		$.get( '/mongo/dock/mailCount', function( numNewMessages ){
			$( '#dock-stats-mail' ).html( '<a href="/user/' + user.username + '/mail">' + numNewMessages + ' ✉</a> ' );
			if( numNewMessages > 0 ){
				$( '#dock-stats-mail a' ).css( 'color', '#FF4C00' );
				$( '#dock-stats-mail' ).fadeTo( 'fast', 1.0, function(){
					$( '#dock-stats-mail' ).fadeTo( 'slow', 0.6 );
				})
			}
		})
		$( '.dock-faded' ).fadeTo( 0, 0.6 );

		$( '.dock-faded' ).hover(
			function() { //hover enter
				$( this ).fadeTo( 0 , 1.0 );
			}, function() { //hover exit
				$( this ).fadeTo( 0 , 0.6 );
			}
		);	
	});
}

$( document ).ready( function() {
	dock.getMail();
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
