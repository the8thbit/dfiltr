var mailConvo = $( '#mailConvo' );

mailConvo.resize = function(){
	$( '#mailConvo-content' ).css( { 'height' :  $( '#mailConvo' ).height() - ( $( '#mailConvo-name' ).outerHeight() ) } );
	profile.resize();
}

mailConvo.addMessage = function( data ){
	if( data && data.message && data.message != '' && data.type ){
		if( data.type == 'partner' ){ var text = '<div class="mailConvo-message mailConvo-red">'  + data.message + '</span>'; } else
		if( data.type == 'self'    ){ var text = '<div class="mailConvo-message mailConvo-blue">' + data.message + '</span>'; }
		$( '#mailConvo-content' ).append( text );
		$( '#mailConvo-content' ).scrollTop( 99999999 );
	};
};

mailConvo.populate = function( conversation ){
	$( '#mailConvo-name' ).html( '<a href="/user/'+ conversation.to +'" class="mailConvo-faded">' + conversation.to + '</a>' );
	for( var i=0; i < conversation.messages.length; i+=1 ){
		if( conversation.messages[i].userId == 0 ){
			$( '#mailConvo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
		} else {
			$( '#mailConvo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
		}
	}
	$( '#mailConvo-content' ).scrollTop( 99999999 );
}

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
mailConvo.createHoverFadeEvent = function(){
	$( '.mailConvo-faded' ).fadeTo( 0, 0.6 );
	$( '.mailConvo-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 0, 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 0, 0.6 );
		}
	);
}

mailConvo.createResizeEvent = function(){
	mailConvo.resize();
	setInterval( function(){
		mailConvo.resize()
	}, 100 );
}

mailConvo.createEvents = function(){
	mailConvo.createResizeEvent();
	mailConvo.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// page load
//-----------------------------------------------------------------------------
mailConvo.load = function( conversation ){
	mailConvo.populate( conversation );
	mailConvo.createEvents();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
mailConvo.init = function( conversation ){
	if(  typeof( dock ) != 'undefined' ){ dock.getMail(); }
	mailConvo.load( conversation );
	$( '#profile-input' ).load( '/profile/mail/mailInput/', function(){ mailInput.init( conversation ); } );
}
