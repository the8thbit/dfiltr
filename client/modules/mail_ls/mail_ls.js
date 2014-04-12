var mail_ls = $( '.mail_ls' );

mail_ls.init = function() {
	$( '.mail_ls-faded' ).fadeTo( 0, 0.7 );
	$( '.mail_ls-faded' ).hover(
		function() {
			$( this ).fadeTo( 0 , 1.0 );
		}, function() {
			$( this ).fadeTo( 0 , 0.7 );
		}
	);
}
