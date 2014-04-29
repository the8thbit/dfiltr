var convos = $( '#convos'  );
convos.username;
convos.pageNum;
convos.pageSize;
convos.sortBy;

convos.resize = function(){
	$( '#convos-content' ).css( { 'height' :  $( '#convos' ).height() - $( '#convos-options' ).height() - 6 } );
}

convos.endlessScroll = function(){
	$( '#convos-content' ).scroll( function(){
		if( $( '#convos-content' ).height() + $( '#convos-content' ).scrollTop() >= $( '#convos-content' ).prop( 'scrollHeight' ) * (4/5) ){
			$( '#convos-content' ).unbind( 'scroll' );
			convos.getConvos();
		}
	});
}

convos.getConvos = function( callback ){
	$.get( '/profile/convos/convoListElm', function( template ){
		$.get( '/mongo/profile/convos/list', { username: convos.username, pageSize: convos.pageSize, pageNum: convos.pageNum, sort: convos.sortBy }, function( data ){
			if( data ){
				convos.pageNum += 1;
				$( '#convos-content' ).append(
					$.map( data, function( conversation, i ){
						var target = $( '<div>', { id: 'convos-content' + i, class: 'convos-content' } ).html( template );
						target.find( '.convoListElm-topic' ).html( conversation.topic );
						target.find( '.convoListElm-deltas-blue' ).html( conversation.deltas[0] + ' ∆' );
						target.find( '.convoListElm-deltas-red' ).html( conversation.deltas[1] + ' ∆' );

						//when the user clicks the topic title, load the convo view page
						target.find( '.convoListElm-topic' ).click( function(){
							profile.history.pushState( { view: 'convo', convo: conversation }, 'convo', '/user/'+convos.username+'/convos/'+conversation._id );
						});	
						return target[0];
					})
				);
				convoListElm.init();
				convos.endlessScroll();
			}
			if( callback){ callback(); }
		});
	});
};

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
convos.createResizeEvent = function(){
	setInterval( function(){
		convos.resize();
	}, 100 );
	convos.resize();
}

convos.createSortEvent = function(){
	$( '#convos-options-sort-select' ).change( function(){
		convos.pageNum = 0;
		convos.sortBy = $( this ).val();
		$( '#convos-content' ).html( '' );
		$( '#convos-content' ).unbind( 'scroll' );
		convos.getConvos();
	});
}

convos.createEvents = function(){
	convos.createSortEvent();
	convos.createResizeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
convos.init = function( username ){
	convos.username = username;
	convos.pageNum = 0;
	convos.pageSize = 50;
	convos.sortBy = 'new';

	convos.getConvos( function(){
		convos.createEvents();
	});
}
