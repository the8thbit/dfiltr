var delta = $( '#delta'  );
delta.username;
delta.pageNum;
delta.pageSize;
delta.sort;

delta.endlessScroll = function() {
	$( '#delta-content' ).scroll( function() {
		if( $( '#delta-content' ).height() + $( '#delta-content' ).scrollTop() >= $( '#delta-content' ).prop( 'scrollHeight' ) * (4/5) ) {
			$( '#delta-content' ).unbind( 'scroll' );
			delta.getDeltas();
		}
	});
}

delta.getDeltas = function() {
	$.get( '/modules/convols/', function( data ) {
		var template = data;

		$.get( '/mongo/profile/delta/list', { username: delta.username, pageSize: delta.pageSize, pageNum: delta.pageNum, sort: delta.sort }, function( data ) {
			if( data ) {
				delta.pageNum += 1;
				$( '#delta-content' ).append(
					$.map( data, function( conversation, i ) {
						var target = $( '<div>', { id: 'delta-content' + i, class: 'delta-content' } ).html( template );
						target.find( '.convols-topic' ).html( conversation.topic );
						target.find( '.convols-deltas-blue' ).html( conversation.deltas[0] + ' ∆' );
						target.find( '.convols-deltas-red' ).html( conversation.deltas[1] + ' ∆' );
	
						//when the user clicks the topic title, load the conversation view page
						target.find( '.convols-topic' ).click( function() {
							profile.history.pushState( { view: 'convo', convo: conversation }, 'conversation', '/user/'+delta.username+'/convo/'+conversation._id );
						});	
						return target[0];
					})
				);
				convols.init();
				delta.endlessScroll();
			}
		});
	});
};

delta.resize = function() {
	$( '#delta-content' ).css( { 'height' :  $( '#delta' ).height() - $( '#delta-options' ).height() - 6 } );
}

delta.init = function( username ) {
	$( '#profile-input' ).html( '' );
	profile.resize();

	delta.username = username;
	delta.pageNum = 0;
	delta.pageSize = 50;
	delta.sort = 'new';

	delta.getDeltas();

	setInterval( function() {
		delta.resize();
	}, 100 );
	
	delta.resize();

	$( '#delta-options-sort-select' ).change( function() {
		delta.pageNum = 0;
		delta.pageSize = 50;
		delta.sort = $( this ).val();
		$( '#delta-content' ).html( '' );
		$( '#delta-content' ).unbind( 'scroll' );
		delta.getDeltas();
	});
}
