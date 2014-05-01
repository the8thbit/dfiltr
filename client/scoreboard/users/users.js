var users = $( '#users'  );
users.pageNum;
users.pageSize;
users.sortBy;

users.resize = function(){
	$( '#users-content' ).css( { 'height' :  $( '#users' ).height() - $( '#users-options' ).height() - 6 } );
}

users.endlessScroll = function(){
	$( '#users-content' ).scroll( function(){
		if( $( '#users-content' ).height() + $( '#users-content' ).scrollTop() >= $( '#users-content' ).prop( 'scrollHeight' ) * (4/5) ){
			$( '#users-content' ).unbind( 'scroll' );
			users.getUsers();
		}
	});
}

users.getUsers = function(){
	$.get( '/scoreboard/users/userListElm', function( template ){
		$.get( '/mongo/scoreboard/users/list', { pageSize: users.pageSize, pageNum: users.pageNum, sort: users.sortBy }, function( data ){
			if( data ){
				users.pageNum += 1;
				$( '#users-content' ).append(
					$.map( data, function( userObj, i ){
						var target = $( '<div>', { id: 'users-content' + i, class: 'users-content' } ).html( template );
						target.find( '.userListElm-topic' ).html( userObj.username );
						target.find( '.userListElm-stats-deltas' ).html( userObj.deltas + ' ∆' );
						target.find( '.userListElm-stats-badges' ).html( userObj.badges + ' ☆' );
	
						//when the user clicks the topic title, load the user view page
						target.find( '.userListElm-topic' ).click( function(){
							window.location = '/user/'+userObj.username;
						});	
						return target[0];
					})
				);
				userListElm.init();
				users.endlessScroll();
			}
		});
	});
};

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
users.createResizeEvent = function(){
	setInterval( function(){
		users.resize();
	}, 100 );
	users.resize();
}

users.createSortEvent = function(){
	$( '#users-options-sort-select' ).change( function(){
		users.pageNum = 0;
		users.sortBy = $( this ).val();
		$( '#users-content' ).html( '' );
		$( '#users-content' ).unbind( 'scroll' );
		users.getUsers();
	});
}

users.createEvents = function(){
	users.createResizeEvent();
	users.createSortEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
users.init = function(){
	users.pageNum = 0;
	users.pageSize = 50;
	users.sortBy = 'most deltas';

	users.createEvents();
	users.getUsers();
}
