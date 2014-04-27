var badges = $( '#badges'  );
badges.username; 
badges.sort;
badges.list = [];

badges.init = function( username ) {
	badges.username = username;
	badges.sort = 'new';

	$( '#profile-input' ).html( '' );
	profile.resize();

	$.get( '/mongo/profile/badges', { username: badges.username, sort: badges.sort }, function( data ) {
		var target = [];
		var difficultyClass;

		if( badges ) {
			for( var i=0; i < data.length; i+=1 ){
				badges.list[i] = data[i];
				if( data[i].difficulty === 'easy'   ) { difficultyClass = 'badges-easy';   } else
				if( data[i].difficulty === 'medium' ) { difficultyClass = 'badges-medium'; } else
				if( data[i].difficulty === 'hard'   ) { difficultyClass = 'badges-hard';   } else
				if( data[i].difficulty === 'secret' ) { difficultyClass = 'badges-secret'; }
			
				target[i] = '<div id="badges-list' + i + '" class="badges-badge ' + difficultyClass + '" >' + data[i].image + '</div>';
			}
			$( '#badges-list' ).append( target );

			for( var i=0; i < data.length; i+=1 ){
				$( '#badges-list' + i ).data( 'date', data[i].date );
				$( '#badges-list' + i ).data( 'description', data[i].description );
				$( '#badges-list' + i ).data( 'image', data[i].image );
			}

			$( '.badges-badge' ).fadeTo( 0, 0.7 );

			$( '.badges-badge' ).click( function(){
				var months = ["January", "February", "March", 
				"April", "May", "June", "July", "August", "September", 
				"October", "November", "December"];
				var rawDate = new Date( $( this ).data( 'date' ) );
				var finalDate = months[rawDate.getMonth()] + ' ' + rawDate.getDate() + ', ' + rawDate.getFullYear(); 

				var that = {};

				that.date = finalDate;
				that.description = $( this ).data( 'description' );
				that.image = $( this ).data( 'image' );
				$( '#badges-viewer' ).css( 'height', '160px' );
				$( '#badges-viewer' ).css( 'border-bottom-width', '1px' );

				var difficulty;
				if( $( this ).hasClass( 'badges-easy'   ) ) { difficulty = 'easy'   } else
				if( $( this ).hasClass( 'badges-medium' ) ) { difficulty = 'medium' } else
				if( $( this ).hasClass( 'badges-hard'   ) ) { difficulty = 'hard'   } else
				if( $( this ).hasClass( 'badges-secret' ) ) { difficulty = 'secret' }

				$( '#badges-viewer' ).load( '/profile/badges/view/', function() { 
					//console.log( that.data( 'badge' ) );
					view.init(
						that.image,
						difficulty,
						'Test Badge',
						'acquired on ' + that.date,
						that.description
					);
				});

				badges.resize();
			});

			$( '.badges-badge' ).hover(
				function() { //hover enter
					$( this ).fadeTo( 'fast', 1.0 );
				}, function() { //hover exit
					$( this ).fadeTo( 'fast', 0.7 );
				}
			);
		}
	});

	$( '#badges-list' ).isotope( {
		itemSelector: '.badges-badge',
		layoutMode: 'fitRows'
	});

	badges.resize = function() {
		$( '#badges-list' ).css( { 'height' :  $( '#badges' ).height() - $( '#badges-options' ).height() - $( '#badges-viewer' ).height() - 7 } );
	}

	setInterval( function() {
		badges.resize();
	}, 100 );
	
	badges.resize();
}
