var badgeView = $( '#badgeView'  );

badgeView.setDifficulty = function( level ){
	if( level ){
		if( level == 'easy' ){
			$( '#badgeView-icon' ).css( 'background-color', '#0B5FA5' );	
			$( '#badgeView-info' ).css( 'background-color', '#043C6B' );	
		} else if( level == 'medium' ){
			$( '#badgeView-icon' ).css( 'background-color', '#ffc40f' );	
			$( '#badgeView-info' ).css( 'background-color', '#A67E05' );	
		} else if( level == 'hard' ){
			$( '#badgeView-icon' ).css( 'background-color', '#FF4C00' );	
			$( '#badgeView-info' ).css( 'background-color', '#A63100' );	
		} else if( level == 'secret' ){
			$( '#badgeView-icon' ).css( 'background-color', 'black' );	
			$( '#badgeView-info' ).css( 'background-color', 'black' );	
		}
	}
}

badgeView.init = function( icon, difficulty, name, date, desc, custom ){
	if( icon   ){ $( '#badgeView-icon'              ).html( icon   ); }
	if( name   ){ $( '#badgeView-info-name'         ).html( name   ); }
	if( date   ){ $( '#badgeView-info-date'         ).html( date   ); }
	if( desc   ){ $( '#badgeView-info-desc'         ).html( desc   ); }
	if( custom ){ $( '#badgeView-info-custom'       ).html( custom ); }
	badgeView.setDifficulty( difficulty );
}
