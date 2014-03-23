var view = $( '#view'  );

view.init = function( icon, level, name, date, desc, custom ) {
	if( icon   ) { $( '#view-icon'              ).html( icon );   }
	if( name   ) { $( '#view-info-name'         ).html( name );   }
	if( date   ) { $( '#view-info-date'         ).html( date );   }
	if( desc   ) { $( '#view-info-desc'         ).html( desc );   }
	if( custom ) { $( '#view-info-custom'       ).html( custom ); }

	if( level ) {
		if( level == 'easy' ) {
			$( '#view-icon' ).css( 'background-color', '#0B5FA5' );	
			$( '#view-info' ).css( 'background-color', '#043C6B' );	
		} else if( level == 'medium' ) {
			$( '#view-icon' ).css( 'background-color', '#ffc40f' );	
			$( '#view-info' ).css( 'background-color', '#A67E05' );	
		} else if( level == 'hard' ) {
			$( '#view-icon' ).css( 'background-color', '#FF4C00' );	
			$( '#view-info' ).css( 'background-color', '#A63100' );	
		} else if( level == 'secret' ) {
			$( '#view-icon' ).css( 'background-color', 'black' );	
			$( '#view-info' ).css( 'background-color', 'black' );	
		}
	}
}
