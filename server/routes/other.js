module.exports = function( app ){
	app.post( '/giveDelta', function( req, res, next ){
		if( req.user && req.user.username && req.body.convo && req.body.color ){
			giveDelta( req.user.username, req.body.convo, req.body.color );
		}
		res.send( null );
	});

	var giveDelta = function( username, convo_id, color ){
		var failure = false;	

		Convo.findById( convo_id, function( err, convo ){		
			if( color === 'blue' ){
				for( var i=0; i < convo.blueDeltas.length; i+=1 ){
					if( convo.blueDeltas[i] === username ) { 
						failure = true;
						break;
					}
				}
				if( !failure ){
					convo.deltas[0] += 1;
					convo.deltas[2] += 1;
					convo.blueDeltas.push( username );
					Convo.findByIdAndUpdate( convo._id, { deltas: convo.deltas, blueDeltas: convo.blueDeltas }, function(){} );
					User.findOne( { username: convo.users[0] }, function( err, user ){
						if( user ){
							user.deltas += 1;
							User.findByIdAndUpdate( user._id, { deltas: user.deltas }, function(){} );
						}
					});
				}
			} else if( color === 'red' ){
				for( var i=0; i < convo.redDeltas.length; i+=1 ){
					if( convo.redDeltas[i] === username ) { 
						failure = true;
						break;
					}
				}
				if( !failure ){
					convo.deltas[1] += 1;
					convo.deltas[2] += 1;
					convo.redDeltas.push( username );
					Convo.findByIdAndUpdate( convo._id, { deltas: convo.deltas, redDeltas: convo.redDeltas }, function(){} );
					User.findOne( { username: convo.users[1] }, function( err, user ){
						if( user ){
							user.deltas += 1;
							User.findByIdAndUpdate( user._id, { deltas: user.deltas }, function(){} );
						}
					});
				}
			}
		});
		app.handleErr( err );
	}
}
