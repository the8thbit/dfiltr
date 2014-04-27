var mail_input = $( '#mail_input' );

mail_input.init = function() {
	mail_input.field         = $( '#mail_input-field' );         //the textarea that the user can type into and send messages from
	mail_input.field.wrap    = $( '#mail_input-field-wrapper' ); //the wrapper for the aforementioned textarea
	mail_input.sendButton    = $( '#mail_input-send' );          //the button used to send messages
	
	//==========================================================================
	// Internal Functions
	//==========================================================================
	mail_input.resize = function() {
		mail_input.field.wrap.css( { 'width' : $( '#mail_input' ).width() - mail_input.sendButton.outerWidth() - 5 } );
	};

	//==========================================================================
	// UI interactions
	//==========================================================================
	mail_input.sendButton.hover(
		function() {
			$( this ).fadeTo( 'fast' , 1.0 );
		}, function() {
			$( this ).fadeTo( 'fast' , 0.6 );
		}
	);

	//sends a message to the contact
	mail_input.send = function( text ) {
		if( text != '' ) {
			mail_input.field.prop( 'value', '' );
			profile.socket.emit( 'send', { message: text } );
			console.log( text );
		};
	};

	//adds a new line to the output field
	$( document ).keydown( function( e ) {
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ) {
			e.preventDefault();
			mail_convo.add( { message: mail_input.field.prop( 'value' ), type:'self' } );
			mail_input.send( mail_input.field.prop( 'value' ) );
		};
	});

	mail_input.sendButton.on( 'click', function() {
		mail_convo.add( { message: mail_input.field.prop( 'value' ), type:'self' } );
		mail_input.send( mail_input.field.prop( 'value' ) );
	});

	mail_input.resize();

	window.onresize = function( event ) {
		mail_input.resize();
		profile.resize();
	};

	mail_input.sendButton.fadeTo( 0, 0.6 );
};
