module.exports = function( app ){
	app.get( '/mongo/profile/convos/list',    function( req, res, next ){ this.getProfileConvoList(        req, res, next ); } );
	app.get( '/mongo/profile/badges/list',    function( req, res, next ){ this.getProfileBadgeList(        req, res, next ); } );
	app.get( '/mongo/profile/mail/list',      function( req, res, next ){ this.getProfileMailList(         req, res, next ); } );
	app.get( '/mongo/profile/mail/convo',     function( req, res, next ){ this.getProfileMailConvo(        req, res, next ); } );
	app.get( '/mongo/profile/mail/access',    function( req, res, next ){ this.setProfileMailDateAccessed( req, res, next ); } );

	app.get( '/mongo/scoreboard/users/list',  function( req, res, next ){ this.getScoreboardUserList(      req, res, next ); } );
	app.get( '/mongo/scoreboard/convos/list', function( req, res, next ){ this.getScoreboardConvoList(     req, res, next ); } );
	app.get( '/mongo/scoreboard/badges/list', function( req, res, next ){ this.getScoreboardBadgeList(     req, res, next ); } );

	app.get( '/mongo/dock/mailCount',         function( req, res, next ){ this.getDockMailCount(           req, res, next ); } );

	//--------------------------------------------------------------------------
	// profile routes
	//--------------------------------------------------------------------------
	this.getProfileConvosList = function( req, res, next ){
		var pageNumber = req.query.pageNum * req.query.pageSize;
		if( req.query.sort == 'most deltas' ){
			Convo.find( { users: { $in: [req.query.username] } } )
				.sort( { deltas: -1 } )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		} else if( req.query.sort == 'length' ){
			Convo.find( { users: { $in: [req.query.username] } } )
				.sort( '-size' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		} else {
			Convo.find( { users: { $in: [req.query.username] } } )
				.sort( '-date' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		}
	}

	this.getProfileBadgeList = function( req, res, next ){
		Badge.find( { "owners.username": req.query.username } ).sort( 'ownerNum' ).exec( function( err, badges ){
			//do client-side sorting for everything except for sort by rarity (ownerNum): hacky solution because I don't understand aggregation
			res.send( badges );
		});
	}

	this.getProfileMailList = function( req, res, next ){
		var pageNumber = req.query.pageNum * req.query.pageSize;
		if( req.query.sort == 'most messages' ){
			Mail.find( { from: req.user.username } ).sort( '-messageNum' ).skip( pageNumber ).limit( req.query.pageSize ).exec( function( err, mail ){
				res.send( mail );
			});
		} else {
			Mail.find( { from: req.user.username } ).sort( '-date' ).skip( pageNumber ).limit( req.query.pageSize ).exec( function( err, mail ){
				res.send( mail );
			});
		}
	}

	this.getProfileMailConvo = function( req, res, next ){
		Mail.findOne( { to: req.query.from, from: req.user.username }, function( err, mail ){
			if( !mail ){ 
				var newMail = new Mail( {
					to: req.query.from,
					from: req.user.username
				});
				newMail.save();
				var newMail2 = new Mail( {
					to: req.user.username,
					from: req.query.from
				});
				newMail2.save();
				res.send( newMail );
			} else {
				res.send( mail );
			}
		});
	}

	this.setProfileMailDateAccessed = function( req, res, next ){
		Mail.findOne( { to: req.query.to, from: req.user.username }, function( err, mail ){
			if( mail ){
				mail.dateAccessed = Date.now();
				mail.newMessages = 0;
				mail.save();
			}
		});
	}

	//--------------------------------------------------------------------------
	// scoreboard routes
	//--------------------------------------------------------------------------
	this.getScoreboardUserList = function( req, res, next ){
		var pageNumber = req.query.pageNum * req.query.pageSize;
		if( req.query.sort == 'most deltas' ){
			User.find()
				.sort( '-deltas' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, users ){
				if( users !== '' ){ 
					res.send( users );
				} else {
					res.send( null );
				}
			});
		} else if( req.query.sort == 'most badges' ){
			User.find()
				.sort( '-badges' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, users ){
				if( users !== '' ){ 
					res.send( users );
				} else {
					res.send( null );
				}
			});
		} else {
			User.find()
				.sort( '-date' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, users ){
				if( users !== '' ){ 
					res.send( users );
				} else {
					res.send( null );
				}
			});
		}
	};

	this.getScoreboardConvoList = function( req, res, next ){
		var pageNumber = req.query.pageNum * req.query.pageSize;
		if( req.query.sort == 'most deltas' ){
			Convo.find()
				.sort( { deltas: -1 } )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		} else if( req.query.sort == 'length' ){
			Convo.find()
				.sort( '-size' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		} else {
			Convo.find()
				.sort( '-date' )
				.skip( pageNumber )
				.limit( req.query.pageSize )
			.exec( function( err, convos ){
				if( convos !== '' ){ 
					res.send( convos );
				} else {
					res.send( null );
				}
			});
		}
	}

	this.getScoreboardBadgeList = function( req, res, next ){
		Badge.find().sort( 'ownerNum' ).exec( function( err, badges ){
			//do client-side sorting for everything except for sort by rarity (ownerNum): hacky solution because I don't understand aggregation
			res.send( badges );
		});
	}

	//--------------------------------------------------------------------------
	// dock routes
	//--------------------------------------------------------------------------
	this.getDockMailCount = function( req, res, next ){
		var newMessageCount = 0;
		Mail.find( { from: req.user.username } ).exec( function( err, mail ){
			if( mail ){
				for( var i=0; i < mail.length; i+=1 ){
					newMessageCount += mail[i].newMessages;
				}
				res.send( '' + newMessageCount + '' );
			}
		});
	}

	return this;
}
