//============================================//
//            SERVER CONFIGURATION            //
//============================================//
if( typeof( window ) === 'undefined' ) {     //
//============================================//
//IP ADDRESS                                  //
  var SERVER_IP =                             //
  'localhost'                                 // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_IP             // toggle on for openshift deploy
//============================================//
//PORT NUMBER                                 //
  var SERVER_PORT =                           //
  8080                                        // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_PORT           // toggle on for openshift deploy
//============================================//
//SECRET FOR SESSION DATA                     //
  var COOKIE_SECRET =                         //
  process.env.DFILT_COOKIE_SECRET             // toggle on for local testing
//process.env.OPENSHIFT_COOKIE_SECRET         // toggle on for openshift deploy
//============================================//
//MONGODB CONNECTION INFO                     //
  var MONGO_USER =                            //
  null                                        // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_USERNAME   // toggle on for openshift deploy
//============================================//
  var MONGO_PASS =                            //
  null                                        // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PASSWORD   // toggle on for openshift deploy
//============================================//
  var MONGO_IP =                              //
  'localhost'                                 // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_HOST       // toggle on for openshift deploy
//============================================//
  var MONGO_PORT =                            //
  27017                                       // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PORT       // toggle on for openshift deploy
//============================================//
  var MONGO_DB_NAME =                         //
  '435'                                       // toggle on for local testing
//'435'                                       // toggle on for openshift deploy
//============================================//
//PREDICTIONIO CONNECTION INFO                //
  var PIO_API_KEY =                           //
  process.env.DFILT_PIO_API_KEY               // toggle on for local testing
//process.env.OPENSHIFT_PIO_API_KEY           // toggle on for openshift deploy
//============================================//
  var PIO_API_IP =                            //
  process.env.DFILT_PIO_API_IP                // toggle on for local testing
//process.env.OPENSHIFT_PIO_API_IP            // toggle on for openshift deploy
//============================================//
  var PIO_API_PORT =                          //
  process.env.DFILT_PIO_API_PORT              // toggle on for local testing
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
//'435-teamnoname.rhcloud.com'                // toggle on for openshift deploy
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
	module.exports.SERVER_IP     = SERVER_IP;
	module.exports.SERVER_PORT   = SERVER_PORT;
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
