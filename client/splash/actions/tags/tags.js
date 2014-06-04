var tags = $( '#splash-tags' );

tags.createHoverFadeEvent = function(){
	$( '.splash-tags-faded' ).fadeTo( 0, 0.6 );
	$( '.splash-tags-faded' ).hover(
		function(){ //hover enter
			$( this ).fadeTo( 'fast', 1.0 );
		}, function(){ //hover exit
			$( this ).fadeTo( 'fast', 0.6 );
		}
	);
}

tags.createEvents = function(){
	tags.createHoverFadeEvent();
}

tags.init = function(){
	tags.css( 'visibility', 'visible' );
	$( '#splash-tags-input' ).tagit({
		caseSensitive: false,
		autocomplete: { delay: 0, minLength: 1 },
		availableTags: [
			'socialism', 'politics', 'economics', 'psychology', 'sociology', 'anarchism', 'capitalism',
			'history', 'class theory', 'ethics', 'trolley problem', 'technology', 'software', 'forecasting',
			'cryptocurrency', 'bitcoin', 'money', 'finance', 'crime', 'death', 'justice', 'feminism',
			'epistemology', 'science', 'education', 'metaphysics‎', 'art', 'pop culture', 'drugs', 'cannabis',
			'marijuana', 'LSD', 'psychadelics', 'farming', 'food', 'physics', 'cosmology', 'metaphysics',
			'medacine', 'labor', 'value', 'sports', 'advertising', 'body image', 'film',
			'film critique', 'film analysis', 'critique', 'literature', 'literary studies',
			'literary critique', 'artificial intelligence', 'neurology', 'mathematics', 'metaphilosophy',
			'climate science', 'philosophy of science', 'video games', 'game critique', 'video game critique',
			'critique', 'games', 'ludology', 'game studies', 'hypothetical', 'hitler', 'story telling',
			'health', 'library science', 'wikipedia', 'law'
		]
	}).focus();
	tags.createEvents();
}
