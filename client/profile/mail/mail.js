var mail = $( '#mail'  );
mail.username;
mail.pageNum;
mail.pageSize;
mail.sort;

mail.endlessScroll = function(){
	$( '#mail-content' ).scroll( function(){
		if( $( '#mail-content' ).height() + $( '#mail-content' ).scrollTop() >= $( '#mail-content' ).prop( 'scrollHeight' ) * (4/5) ){
			$( '#mail-content' ).unbind( 'scroll' );
			mail.getMail();
		}
	});
}

mail.getMail = function( username ){
	$.get( '/isLogged', function( user ){
		if( user.username == username ){
			$.get( '/modules/mail_ls/', function( data ){
				var template = data;
 		
				$.get( '/mongo/profile/mail/list', { pageNum: mail.pageNum, pageSize: mail.pageSize, sort: mail.sort }, function( data ){
					delta.pageNum += 1;
					$( '#mail-content' ).append(
						$.map( data, function( conversation, i ){
							var target = $( '<div>', { id: 'mail-content' + i, class: 'mail-content' } ).html( template );
							target.find( '.mail_ls-name-text'    ).html( conversation.to );
							target.find( '.mail_ls-preview-text' ).html( conversation.messages[conversation.messages.length-1].message );
			
							console.log( conversation );
							//check to see if new messages exist
							if( conversation.newMessages == 1 ){
								target.find( '.mail_ls-msgs-text' ).html( '1 new message' );
							} else if( conversation.newMessages >= 1 ){
								target.find( '.mail_ls-msgs-text' ).html( conversation.newMessages + ' new messages' );
							}

							//when the user clicks the topic title, load the conversation view page
							target.find( '.mail_ls' ).click( function(){
								profile.history.pushState( { view: 'mailConvo', convo: conversation }, 'mail', '/user/'+delta.username+'/mail/'+conversation.to );
							});
							return target[0];
						})
					);
					mail.endlessScroll();
				});
			})
		} else {
			$.get( '/mongo/profile/mail/convo', { from: username }, function( conversation ){
				$( '#mail' ).load( '/modules/mail_convo/', function(){
					profile.socket.emit( 'partner', conversation.to );
					$( '#mail_convo-name' ).html( '<a href="/user/'+ conversation.to +'" class="mail_convo-faded">' + conversation.to + '</a>' );
					mail_convo.init( conversation );
					for( var i=0; i < conversation.messages.length; i++ ){
						if( conversation.messages[i].userId == 0 ){
							$( '#mail_convo-content' ).append( '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>' );
						} else {
							$( '#mail_convo-content' ).append( '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>' );
						}
					}
				});
			});
		}
	});
}

mail.init = function( username ){
	$( '#profile-input' ).html( '' );
	profile.resize();

	mail.username = username;
	mail.pageNum = 0;
	mail.pageSize = 50;
	mail.sort = 'new';
	
	mail.getMail( username );

	$( '#mail-options-sort-select' ).change( function(){
		mail.pageNum = 0;
		mail.pageSize = 50;
		mail.sort = $( this ).val();
		$( '#mail-content' ).html( '' );
		$( '#mail-content' ).unbind( 'scroll' );
		mail.getMail( username );
	});

	mail.resize = function(){
		$( '#mail-content' ).css( { 'height' :  $( '#mail' ).height() - $( '#mail-options' ).height() - 6 } );
	}

	setInterval( function(){
		mail.resize();
	}, 100 );
	
	mail.resize();
}
