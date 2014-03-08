//============================================//
//            SERVER CONFIGURATION            //
//============================================//
//if( process.env ) {                         // TOGGLE ON FOR OPENSHIFT DEPLOY
//============================================//
//IP ADDRESS                                  //
  var SERVER_IP =                             //
  'localhost';                                // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_IP;            // toggle on for openshift deploy
//============================================//
//PORT NUMBER                                 //
  var SERVER_PORT =                           //
  8080;                                       // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_PORT;          // toggle on for openshift deploy
//============================================//
//MONGODB CONNECTION INFO                     //
  var MONGO_USER =                            //
  null                                        // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_USERNAME;  // toggle on for openshift deploy
//============================================//
  var MONGO_PASS =                            //
  null                                        // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PASSWORD;  // toggle on for openshift deploy
//============================================//
  var MONGO_IP =                              //
  'localhost'                                 // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_HOST;      // toggle on for openshift deploy
//============================================//
  var MONGO_PORT =                            //
  27017                                       // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PORT;      // toggle on for openshift deploy
//============================================//
//}                                           // TOGGLE ON FOR OPENSHIFT DEPLOY
//============================================//

//============================================//
//            CLIENT CONFIGURATION            //
//============================================//
//IP ADDRESS                                  //
  var CLIENT_IP =                             //
  'localhost';                                // toggle on for local testing
//'435-teamnoname.rhcloud.com';               // toggle on for openshift deploy
//============================================//
//PORT NUMBER                                 //
  var CLIENT_PORT =                           //
  8080;                                       // toggle on for local testing
//8000;                                       // neccessary for openshift, as websockets is restricted to this port
//============================================//





if( process == 'SERVER' || process.env ) {
	module.exports.CLIENT_IP   = CLIENT_IP;
	module.exports.CLIENT_PORT = CLIENT_PORT;
	module.exports.SERVER_IP   = SERVER_IP;
	module.exports.SERVER_PORT = SERVER_PORT;
	module.exports.MONGO_USER  = MONGO_USER;
	module.exports.MONGO_PASS  = MONGO_PASS;
	module.exports.MONGO_IP    = MONGO_IP;
	module.exports.MONGO_PORT  = MONGO_PORT;
}
