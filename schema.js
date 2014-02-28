//=============================================================================
//CONNECTS TO MONGODB AND SETS UP SCHEMA
//=============================================================================
var MongoClient = require( 'mongodb' ).MongoClient
var format      = require( 'util' ).format;

//=========================TEST MONGO CODE=====================================
MongoClient.connect( 'mongodb://127.0.0.1:27017/chatappdb', function( err, db ) {
	if( err ) { throw err; }

	var collection = db.collection( 'userscollection' );
	collection.insert( { a:2 }, function( err, docs ) {
		collection.count( function( err, count ) {
			console.log( format( 'count = %s', count ) );
		});
		// Locate all the entries using find
		collection.find().toArray( function( err, results ) {
			console.dir( results ); 
			db.close();
		});
	});
})
//======================END OF TEST MONGO CODE=================================
