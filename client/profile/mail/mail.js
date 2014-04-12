var mail = $( '#mail'  );

mail.init = function( username ) {
	$( '#profile-input' ).html( '' );
	profile.resize();

	$.get( '/isLogged', function( user ) {
		if( user.username == username ) {
			$.get( '/modules/mail_ls/', function( data ) {
				var template = data;
 		
				$.get( '/mongo/profile/mail', { name: username }, function( data ) {
					$( '#mail-content' ).append(
						$.map( data, function( conversation, i ) {
							var target = $( '<div>', { id: 'mail-content' + i, class: 'mail-content' } ).html( template );
							target.find( '.mail_ls-name-text'    ).html( conversation.from );
							target.find( '.mail_ls-preview-text' ).html( conversation.messages[conversation.messages.length-1].message );
	
							//when the user clicks the topic title, load the conversation view page
							target.find( '.mail_ls' ).click( function() {
								$( '#mail' ).load( '/modules/mail_convo/', function() {
									profile.socket.emit( 'partner', conversation.from );
									$( '#mail_convo-name' ).html( '<a href="/user/'+ conversation.from +'" class="mail_convo-faded">' + conversation.from + '</a>' );
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
			$.get( '/mongo/profile/mail2', { from: username, to: user.username }, function( conversation ) {
				$( '#mail' ).load( '/modules/mail_convo/', function() {
					profile.socket.emit( 'partner', conversation.from );
					$( '#mail_convo-name' ).html( '<a href="/user/'+ conversation.from +'" class="mail_convo-faded">' + conversation.from + '</a>' );
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
