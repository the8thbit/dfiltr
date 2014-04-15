var mail = $( '#mail'  );

mail.init = function( username ) {
	$( '#profile-input' ).html( '' );
	profile.socket.emit( 'virtual disconnect' );
	profile.resize();

	$.get( '/isLogged', function( user ) {
		if( user.username == username ) {
			$.get( '/modules/mail_ls/', function( data ) {
				var template = data;
 		
				$.get( '/mongo/profile/mail/list', { pageNum: 0, pageSize: 50 }, function( data ) {
					$( '#mail-content' ).append(
						$.map( data, function( conversation, i ) {
							var target = $( '<div>', { id: 'mail-content' + i, class: 'mail-content' } ).html( template );
							target.find( '.mail_ls-name-text'    ).html( conversation.to );
							target.find( '.mail_ls-preview-text' ).html( conversation.messages[conversation.messages.length-1].message );
			
							//check to see if new messages exist
							if( conversation.new == 1 ) {
								target.find( '.mail_ls-msgs-text' ).html( '1 new message' );
							} else if( conversation.new >= 1 ) {
								target.find( '.mail_ls-msgs-text' ).html( conversation.new + ' new messages' );
							}

							//when the user clicks the topic title, load the conversation view page
							target.find( '.mail_ls' ).click( function() {
								$( '#mail' ).load( '/modules/mail_convo/', function() {
									profile.socket.emit( 'partner', conversation.to );
									profile.socket.emit( 'clear new', conversation.to );
									$( '#mail_convo-name' ).html( '<a href="/user/'+ conversation.to +'" class="mail_convo-faded">' + conversation.to + '</a>' );
									mail_convo.init();
									for( var i=0; i < conversation.messages.length; i++ ) {
										if( conversation.messages[i].userId == 0 ) {
											$( '#mail_convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
										} else {
											$( '#mail_convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
										}
									}
								});
							});
	
							return target[0];
						})
					);
				});
			})
		} else {
			$.get( '/mongo/profile/mail/convo', { from: username }, function( conversation ) {
				$( '#mail' ).load( '/modules/mail_convo/', function() {
					profile.socket.emit( 'partner', conversation.to );
					$( '#mail_convo-name' ).html( '<a href="/user/'+ conversation.to +'" class="mail_convo-faded">' + conversation.to + '</a>' );
					mail_convo.init();
					for( var i=0; i < conversation.messages.length; i++ ) {
						if( conversation.messages[i].userId == 0 ) {
							$( '#mail_convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
						} else {
							$( '#mail_convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
						}
					}
				});
			});
		}
	});
	
	mail.resize = function() {
		$( '#mail-content' ).css( { 'height' :  $( '#mail' ).height() - $( '#mail-options' ).height() - 6 } );
	}

	setInterval( function() {
		mail.resize();
	}, 100 );
	
	mail.resize();
}
