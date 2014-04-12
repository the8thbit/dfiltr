var options = $( '#options'  );

options.init = function() {
	$( '#profile-input' ).html( '' );
	profile.resize();
	$( '.options-faded' ).fadeTo( 0, 0.6 );
	$( '.options-faded' ).hover(
		function() { //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);

	$( '#options-logout' ).click( function() { 
		$.get( '/logout', function() { 
			window.location = '/';
		});
	});

	
	$( '#options-pass' ).on( 'submit', function( event ) { 
		event.preventDefault();

		$( '#options-pass-new-input'    ).css( 'border-color', 'grey' )
		$( '#options-pass-new-error'    ).html( '' );
		$( '#options-pass-verify-input' ).css( 'border-color', 'grey' )
		$( '#options-pass-verify-error' ).html( '' );
		$( '#options-pass-old-input'    ).css( 'border-color', 'grey' )
		$( '#options-pass-old-error'    ).html( '' );

		options.validationFail = false;
	
		if( $( '#options-pass-new-input' ).prop( 'value' ) == '' ) {
			options.validationFail = true;
			$( '#options-pass-new-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-pass-new-error' ).html( 'you forgot to enter a new password' );
		};

		if( $( '#options-pass-verify-input' ).prop( 'value' ) == '' ) {
			options.validationFail = true;
			$( '#options-pass-verify-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-pass-verify-error' ).html( 'please verify your new password' );
		} else if( $( '#options-pass-verify-input' ).prop( 'value' ) != $( '#options-pass-new-input' ).prop( 'value' ) ) {
			options.validationFail = true;
			$( '#options-pass-verify-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-pass-verify-error' ).html( 'your passwords don\'t match' );
		};

		if( $( '#options-pass-old-input' ).prop( 'value' ) == '' ) {
			options.validationFail = true;
			$( '#options-pass-old-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-pass-old-error' ).html( 'please enter your old password' );
		};

		if( !options.validationFail ) {
			$.post( '/changePass', $( this ).serialize(), function( res ) {
				if( res == 'bad pass' ) {
					$( '#options-pass-old-input' ).css(  'border-color', '#FF4C00' );
					$( '#options-pass-old-error' ).html( 'the password you entered is incorrect' );
				} else if( res == 'success' ) {
					$( '#options-pass-header' ).html( 'Your password has been reset.' );
					$( '#options-pass' ).html( $( '#options-pass-header' ) );
				}
			});
		};
	});

	$( '#options-email' ).on( 'submit', function( event ) { 
		event.preventDefault();

		$( '#options-email-new-input'  ).css( 'border-color', 'grey' )
		$( '#options-email-new-error'  ).html( '' );
		$( '#options-email-pass-input' ).css( 'border-color', 'grey' )
		$( '#options-email-pass-error' ).html( '' );

		var validationFail = false;
	
		if( $( '#options-email-new-input' ).prop( 'value' ) == '' ) {
			validationFail = true;
			$( '#options-email-new-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-email-new-error' ).html( 'you forgot to enter a new email address' );
		};

		if( $( '#options-email-pass-input' ).prop( 'value' ) == '' ) {
			validationFail = true;
			$( '#options-email-pass-input' ).css(  'border-color', '#FF4C00' );
			$( '#options-email-pass-error' ).html( 'please enter your old password' );
		};

		if( !validationFail ) {
			$.post( '/changeEmail', $( this ).serialize(), function( res ) {
				if( res == 'bad pass' ) {
					$( '#options-email-pass-input' ).css(  'border-color', '#FF4C00' );
					$( '#options-email-pass-error' ).html( 'the password you entered is incorrect' );
				} else if( res == 'success' ) {
					$( '#options-email-header' ).html( 'Your email has been reset.' );
					$( '#options-email' ).html( $( '#options-email-header' ) );
				}
			});
		};
	});
}
