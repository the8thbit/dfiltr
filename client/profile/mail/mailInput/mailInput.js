var mailInput = $( '#mailInput' );

mailInput.resize = function(){
	$( '#mailInput-field-wrapper' ).css( { 'width' : $( '#mailInput' ).width() - $( '#mailInput-send' ).outerWidth() - 5 } );
};

mailInput.sendMessage = function( text ){
	if( text != '' ){
		$( '#mailInput-field' ).prop( 'value', '' );
		profile.socket.emit( 'send', { message: text } );
	};
};

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
mailInput.createResizeEvent = function(){
	mailInput.resize();
	window.onresize = function( event ){ mailInput.resize(); };
}

mailInput.createSendEvent = function(){
	$( document ).keydown( function( e ){
		//ENTER KEY: send message 
		if( e.keyCode == 13 && !e.shiftKey ){
			e.preventDefault();
			mailConvo.addMessage( { message: $( '#mailInput-field' ).prop( 'value' ), type:'self' } );
			mailInput.sendMessage( $( '#mailInput-field' ).prop( 'value' ) );
		};
	});

	$( '#mailInput-send' ).on( 'click', function(){
		mailConvo.addMessage( { message: $( '#mailInput-field' ).prop( 'value' ), type:'self' } );
		mailInput.sendMessage( $( '#mailInput-field' ).prop( 'value' ) );
	});
}

mailInput.createHoverFadeEvent = function(){
	$( '#mailInput-send' ).fadeTo( 0, 0.6 );
	$( '#mailInput-send' ).hover(
		function(){ //on enter
			$( this ).fadeTo( 'fast' , 1.0 );
		}, function(){ //on exit
			$( this ).fadeTo( 'fast' , 0.6 );
		}
	);
}

mailInput.createEvents = function(){
	mailInput.createResizeEvent();
	mailInput.createSendEvent();
	mailInput.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// page load
//-----------------------------------------------------------------------------
mailInput.load = function(){
	$( '#profile-input' ).load( '/profile/mail/mailInput/', function(){
		profile.resize();
		mailInput.createEvents();
	});
}


//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
mailInput.init = function( conversation ){
	profile.socket.emit( 'partner', conversation.to );
	profile.socket.emit( 'clear new', conversation.to );
	mailInput.load();
};
