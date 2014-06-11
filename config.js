//============================================//
//            SERVER CONFIGURATION            //
//============================================//
if( typeof( window ) === 'undefined' ) {     // if there isn't a window, then this is severside, so do serverside config
//============================================//
//IP ADDRESS                                  //
  var SERVER_IP =                             //
  process.env.DFILTR_NODEJS_IP                // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_IP             // toggle on for openshift deploy
//============================================//
//PORT NUMBER                                 //
  var SERVER_PORT =                           //
  process.env.DFILTR_NODEJS_PORT              // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_PORT           // toggle on for openshift deploy
//============================================//
//SECRET FOR SESSION DATA                     //
  var COOKIE_SECRET =                         //
  process.env.DFILTR_COOKIE_SECRET            // toggle on for local testing
//process.env.OPENSHIFT_COOKIE_SECRET         // toggle on for openshift deploy
//============================================//
//MONGODB CONNECTION INFO                     //
  var MONGO_USER =                            //
  process.env.DFILTR_MONGO_DB_USERNAME        // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_USERNAME   // toggle on for openshift deploy
//============================================//
  var MONGO_PASS =                            //
  process.env.DFILTR_MONGO_DB_PASS            // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PASSWORD   // toggle on for openshift deploy
//============================================//
  var MONGO_IP =                              //
  process.env.DFILTR_MONGO_DB_IP              // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_IP         // toggle on for openshift deploy
//============================================//
  var MONGO_PORT =                            //
  process.env.DFILTR_MONGO_DB_PORT            // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PORT       // toggle on for openshift deploy
//============================================//
  var MONGO_DB_NAME =                         //
  process.env.DFILTR_MONGO_DB_NAME            // toggle on for local testing
//process.env.OPENSHIFT_MONGO_DB_NAME         // toggle on for openshift deploy
//============================================//
//PREDICTIONIO CONNECTION INFO                //
  var PIO_API_KEY =                           //
  process.env.DFILTR_PIO_API_KEY              // toggle on for local testing
//process.env.OPENSHIFT_PIO_API_KEY           // toggle on for openshift deploy
//============================================//
  var PIO_API_IP =                            //
  process.env.DFILTR_PIO_API_IP               // toggle on for local testing
//process.env.OPENSHIFT_PIO_API_IP            // toggle on for openshift deploy
//============================================//
  var PIO_API_PORT =                          //
  process.env.DFILTR_PIO_API_PORT             // toggle on for local testing
//process.env.OPENSHIFT_PIO_API_PORT          // toggle on for openshift deploy
//============================================//
}                                             //
//============================================//

//============================================//
//            CLIENT CONFIGURATION            //
//============================================//
//IP ADDRESS                                  //
  var CLIENT_IP =                             //
  'localhost'                                 // toggle on for local testing
//'dfiltr.com'                                // toggle on for openshift deploy (swap in your own domain)
//============================================//
//PORT NUMBER                                 //
  var CLIENT_PORT =                           //
  8080                                        // toggle on for local testing
//8000                                        // neccessary for openshift, as websockets is restricted to this port
//============================================//


//serverside exports
if( typeof( window ) === 'undefined' ) {
	module.exports.CLIENT_IP     = CLIENT_IP;
	module.exports.CLIENT_PORT   = CLIENT_PORT;
	module.exports.CLIENT_HOST   = CLIENT_IP + ':' + CLIENT_PORT;
	module.exports.SERVER_IP     = SERVER_IP;
	module.exports.SERVER_PORT   = SERVER_PORT;
	module.exports.SERVER_HOST   = SERVER_IP + ':' + SERVER_PORT;
	module.exports.COOKIE_SECRET = COOKIE_SECRET;
	module.exports.MONGO_USER    = MONGO_USER;
	module.exports.MONGO_PASS    = MONGO_PASS;
	module.exports.MONGO_IP      = MONGO_IP;
	module.exports.MONGO_PORT    = MONGO_PORT;
	module.exports.MONGO_DB_NAME = MONGO_DB_NAME;
	module.exports.PIO_API_KEY   = PIO_API_KEY;
	module.exports.PIO_API_IP    = PIO_API_IP;
	module.exports.PIO_API_PORT  = PIO_API_PORT;
	module.exports.PIO_API_HOST  = PIO_API_IP + ':' + PIO_API_PORT;
}
