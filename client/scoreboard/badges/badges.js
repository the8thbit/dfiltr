var badges = $( '#badges'  );
badges.sortBy;

badges.resize = function(){
	$( '#badges-list' ).css( { 'height' :  $( '#badges' ).height() - $( '#badges-options' ).height() - $( '#badges-viewer' ).height() - 7 } );
}

badges.formatDate = function( date ){
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var rawDate = new Date( date );
	var finalDate = 'created on ' + months[rawDate.getMonth()] + ' ' + rawDate.getDate() + ', ' + rawDate.getFullYear();
	return finalDate;
}

badges.sortByDate = function( sortedBadges ){
	sortedBadges.sort(function (a, b){
		if( a.date < b.date ){
			return 1;
		} else {
			return -1;
		}
	});
	return sortedBadges;
}

badges.sortByDifficulty = function( data ){
	var easyBadges   = [];
	var mediumBadges = [];
	var hardBadges   = [];
	var secretBadges = [];
	var sortedBadges;

	for( var i=0; i < data.length; i+=1 ){
		if( data[i].difficulty === 'easy'   ){ easyBadges.push(   data[i] ); }
		if( data[i].difficulty === 'medium' ){ mediumBadges.push( data[i] ); }
		if( data[i].difficulty === 'hard'   ){ hardBadges.push(   data[i] ); }
		if( data[i].difficulty === 'secret' ){ secretBadges.push( data[i] ); }
	}
	sortedBadges = secretBadges.concat( hardBadges ).concat( mediumBadges ).concat( easyBadges );

	return sortedBadges;
}

//grab the badges from the server and place them into the HTML, putting metadata into the .data field
badges.getBadges = function( onComplete ){
	$.get( '/mongo/scoreboard/badges/list', function( data ) {
		var template = [];
		if( data ){
			if( badges.sortBy === 'new' ){ data = badges.sortByDate( data ); }
			if( badges.sortBy === 'difficulty' ){ data = badges.sortByDifficulty( data ); }

			for( var i=0; i < data.length; i+=1 ){
				//let template[i] be <div id="badges-listNum" class="badges-badge badges-difficulty">badgeImage</div>
				template[i] = '<div id="badges-list'+i + '" class="badges-badge ' + 'badges-'+data[i].difficulty + '" >' + data[i].image + '</div>';
			}
			$( '#badges-list' ).append( template );

			for( var i=0; i < data.length; i+=1 ){
				$( '#badges-list' + i ).data( 'title',       data[i].title );
				$( '#badges-list' + i ).data( 'description', data[i].description );
				$( '#badges-list' + i ).data( 'difficulty',  data[i].difficulty );
				$( '#badges-list' + i ).data( 'custom',      data[i].custom );
				$( '#badges-list' + i ).data( 'image',       data[i].image );
				$( '#badges-list' + i ).data( 'date',        badges.formatDate( data[i].date ) );
			}
		}
		onComplete();
	});
}

//-----------------------------------------------------------------------------
// events
//-----------------------------------------------------------------------------
badges.createResizeEvent = function(){
	badges.resize();
	setInterval( function() {
		badges.resize();
	}, 100 );
}

badges.createBadgeClickEvent = function(){
	$( '.badges-badge' ).click( function(){
		var badgeData = $( this ).data(); //grab all of the badge metadata and throw it in badgeData
		$( '#badges-viewer' ).css( 'height', '160px' );
		$( '#badges-viewer' ).css( 'border-bottom-width', '1px' );

		$( '#badges-viewer' ).load( '/scoreboard/badges/badgeView/', function() { 
			badgeView.init(
				badgeData.image,
				badgeData.difficulty,
				badgeData.title,
				badgeData.date,
				badgeData.description,
				badgeData.custom
			);
		});
		badges.resize();
	});
}

badges.createSortEvent = function(){
	$( '#badges-options-sort-select' ).change( function(){
		badges.sortBy = $( this ).val();
		$( '#badges-list' ).html( '' );
		badges.getBadges( function(){
			badges.createEvents();
			$( '#badges-list' ).isotope( { itemSelector: '.badges-badge', layoutMode: 'fitRows' } );
		});
	});
}

badges.createHoverFadeEvent = function(){
	$( '.badges-badge' ).fadeTo( 0, 0.6 );
	$( '.badges-badge' ).hover(
		function() { //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function() { //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

badges.createEvents = function(){
	badges.createResizeEvent();
	badges.createBadgeClickEvent();
	badges.createHoverFadeEvent();
}

//-----------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------
badges.init = function(){
	badges.sortBy = 'new';

	badges.getBadges( function(){ 
		badges.createEvents();
		badges.createSortEvent();
		$( '#badges-list' ).isotope( { itemSelector: '.badges-badge', layoutMode: 'fitRows' } );
	});
}
