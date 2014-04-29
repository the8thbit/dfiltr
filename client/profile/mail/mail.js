var mail = $( '#mail' );
mail.username;
mail.pageNum;
mail.pageSize;
mail.sortBy;

mail.resize = function(){
	$( '#mail-content' ).css( { 'height' :  $( '#mail' ).height() - $( '#mail-options' ).height() - 6 } );
}

mail.endlessScroll = function(){
	$( '#mail-content' ).scroll( function(){
		if( $( '#mail-content' ).height() + $( '#mail-content' ).scrollTop() >= $( '#mail-content' ).prop( 'scrollHeight' ) * (4/5) ){
			$( '#mail-content' ).unbind( 'scroll' );
			mail.getMail();
		}
	});
}

mail.getMailList = function(){
	$.get( '/profile/mail/mailListElm/', function( template ){
		$.get( '/mongo/profile/mail/list', { username: mail.username, pageNum: mail.pageNum, pageSize: mail.pageSize, sort: mail.sortBy }, function( data ){
			mail.pageNum += 1;
			$( '#mail-content' ).append(
				$.map( data, function( conversation, i ){
					var target = $( '<div>', { id: 'mail-content' + i, class: 'mail-content' } ).html( template );
					target.find( '.mailListElm-name-text'    ).html( conversation.to );
					target.find( '.mailListElm-preview-text' ).html( conversation.messages[conversation.messages.length-1].message );
			
					//check to see if new messages exist
					if( conversation.newMessages == 1 ){
						target.find( '.mailListElm-msgs-text' ).html( '1 new message' );
					} else if( conversation.newMessages >= 1 ){
						target.find( '.mailListElm-msgs-text' ).html( conversation.newMessages + ' new messages' );
					}

					//when the user clicks the topic title, load the conversation view page
					target.find( '.mailListElm' ).click( function(){
						profile.history.pushState( { view: 'mailConvo', convo: conversation }, 'mail', '/user/'+mail.username+'/mail/'+conversation.to );
					});
					return target[0];
				})
			);
			mail.endlessScroll();
		});
	});
}

mail.getMailConvo = function( callback ){
	$.get( '/mongo/profile/mail/convo', { from: mail.username, pageNum: mail.pageNum, pageSize: mail.pageSize, sort: mail.sortBy }, function( conversation ){
		$( '#profile-viewer' ).load( '/profile/mail/mailConvo/', function(){
			var template = '';
			profile.socket.emit( 'partner', conversation.to );
			$( '#mailConvo-name' ).html( '<a href="/user/'+ conversation.to +'" class="mailConvo-faded">' + conversation.to + '</a>' );
			mailConvo.init( conversation );
			for( var i=0; i < conversation.messages.length; i+=1 ){
				if( conversation.messages[i].userId == 0 ){
					template += '<div class="convo-message convo-blue">' + conversation.messages[i].message + '</div>';
				} else {
					template += '<div class="convo-message convo-red">'  + conversation.messages[i].message + '</div>';
				}
			}
			$( '#mailConvo-content' ).append( template );
			if( callback ){ callback(); }
		});
	});
}

mail.getMail = function(){
	$.get( '/isLogged', function( user ){
		if( user && user.username === mail.username ){
			mail.getMailList();
		} else {
			mail.getMailConvo();
		}
	});
}

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
mail.createResizeEvent = function(){
	mail.resize();
	setInterval( function(){
		mail.resize();
	}, 100 );
}

mail.createSortEvent = function(){
	$( '#mail-options-sort-select' ).change( function(){
		mail.pageNum = 0;
		mail.sortBy = $( this ).val();
		$( '#mail-content' ).html( '' );
		$( '#mail-content' ).unbind( 'scroll' );
		mail.getMail();
	});
}

mail.createEvents = function(){
	mail.createResizeEvent();
	mail.createSortEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
mail.init = function( username ){
	mail.username = username;
	mail.pageNum = 0;
	mail.pageSize = 50;
	mail.sortBy = 'new';

	mail.createEvents();

	mail.getMail();
}
