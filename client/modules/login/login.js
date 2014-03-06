$( '.login-submit' ).fadeTo( 0, 0.6 );

$( '.login-submit' ).hover( 
	function() { //hover enter
		$( this ).fadeTo( 'fast', 1.0 );
	}, function() { //hover exit
		$( this ).fadeTo( 'fast', 0.6 );
	}
);

//=============================================================================
// login form submit
//=============================================================================
$( '#login-log' ).on( 'submit', function( event ) { 
	event.preventDefault();

	$( '#login-log-input-name' ).css( 'border-color', 'grey' )
	$( '#login-log-name-err' ).html( '' );
	$( '#login-log-input-pass' ).css( 'border-color', 'grey' )
	$( '#login-log-pass-err' ).html( '' );
	$( '#login-log-err' ).html( '' );

	var validationFail = false;

	if( $( '#login-log-input-name' ).prop( 'value' ) == '' ) {
		validationFail = true;
		$( '#login-log-input-name' ).css( 'border-color', '#FF4C00' );
		$( '#login-log-name-err' ).html( 'please enter your username' );
	}	

	if( $( '#login-log-input-pass' ).prop( 'value' ) == '' ) {
		validationFail = true;
		$( '#login-log-input-pass' ).css( 'border-color', '#FF4C00' )
		$( '#login-log-pass-err' ).html( 'please enter your password' );
	}

	if( !validationFail ) {
		$.get( '/login', $( this ).serialize(), function( res ) {
			if( res == 'bad name' ) {
				$( '#login-log-input-name' ).css( 'border-color', '#FF4C00' );
				$( '#login-log-name-err' ).html( 'that username doesn\'t exist' );
			} else if( res == 'bad pass' ) {
				$( '#login-log-input-pass' ).css( 'border-color', '#FF4C00' )
				$( '#login-log-pass-err' ).html( 'the password you entered is incorrect' );
			} else if( res.username ) {
				window.location.reload( true );
			} else { $( '#login-log-err' ).html( '<div>there was an error logging you in</div><div>please try again later</div>' ); }
		});
	}
});

//=============================================================================
// registration form submit
//=============================================================================
$( '#login-reg' ).on( 'submit', function( event ) { 
	event.preventDefault();

	$( '#login-reg-input-name' ).css( 'border-color', 'grey' )
	$( '#login-reg-name-err' ).html( '' );
	$( '#login-reg-input-email' ).css( 'border-color', 'grey' )
	$( '#login-reg-email-err' ).html( '' );
	$( '#login-reg-input-pass' ).css( 'border-color', 'grey' )
	$( '#login-reg-pass-err' ).html( '' );
	$( '#login-reg-input-verify' ).css( 'border-color', 'grey' )
	$( '#login-reg-verify-err' ).html( '' );
	$( '#login-reg-err' ).html( '' );

	var validationFail = false;

	if( $( '#login-reg-input-name' ).prop( 'value' ) == '' ) {
		validationFail = true;
		$( '#login-reg-input-name' ).css( 'border-color', '#FF4C00' );
		$( '#login-reg-name-err' ).html( 'please enter your username' );
	}
	if( $( '#login-reg-input-name' ).prop( 'value' ).length > 256 ) {
		validationFail = true;
		$( '#login-reg-input-name' ).css( 'border-color', '#FF4C00' );
		$( '#login-reg-name-err' ).html( 'Hold up there, partner. Your username is waaaay too long.' );
	}
	if( $( '#login-reg-input-pass' ).prop( 'value' ) == '' ) {
		validationFail = true;
		$( '#login-reg-input-pass' ).css( 'border-color', '#FF4C00' )
		$( '#login-reg-pass-err' ).html( 'please enter your password' );
	}
	if( $( '#login-reg-input-verify' ).prop( 'value' ) == '' ) {
		validationFail = true;
		$( '#login-reg-input-verify' ).css( 'border-color', '#FF4C00' )
		$( '#login-reg-verify-err' ).html( 'please verify your password' );
	}
	if( $( '#login-reg-input-verify' ).prop( 'value' ) != $( '#login-reg-input-pass' ).prop( 'value' ) ) {
		validationFail = true;
		$( '#login-reg-input-verify' ).css( 'border-color', '#FF4C00' )
		$( '#login-reg-verify-err' ).html( 'your passwords don\'t match' );
	}

	if( !validationFail ) {
		$.post( '/register', $( this ).serialize(), function( res ) {
			if( res == 'bad name' ) {
				$( '#login-reg-input-name' ).css( 'border-color', '#FF4C00' );
				$( '#login-reg-name-err' ).html( 'that username is already taken' );
			} else if( res == 'success' ) {
				window.location = '/';
			} else { $( '#login-reg-err' ).html( '<div>there was an error logging you in</div><div>please try again later</div>' ); }
		});
	}
});
