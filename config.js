if( SERVER ) {
//========================================//
//          SERVER CONFIGURATION          //
//========================================//
//IP ADDRESS                              //
  var SERVER_IP =                         //
  'localhost';                            // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_IP;        // toggle on for openshift deploy
//========================================//
//PORT NUMBER                             //
  var SERVER_PORT =                       //
  8080;                                   // toggle on for local testing
//process.env.OPENSHIFT_NODEJS_PORT;      // toggle on for openshift deploy
//========================================//
//MONGODB CONNECTION INFO                 //
  var MONGO_IP =                          //
  'mongodb://localhost'                   // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_URL;   // toggle on for openshift deploy
//========================================//
  var MONGO_PORT =                        //
  27017                                   // toggle on for local testing
//process.env.OPENSHIFT_MONGODB_DB_PORT;  //
//========================================//
} else if( CLIENT ) {
//========================================//
//          CLIENT CONFIGURATION          //
//========================================//
//IP ADDRESS                              //
  var CLIENT_IP =                         //
  'localhost';                            // toggle on for local testing
//'435-teamnoname.rhcloud.com';           // toggle on for openshift deploy
//========================================//
//PORT NUMBER                             //
  var CLIENT_PORT =                       //
  8080;                                   // toggle on for local testing
//8000;                                   // neccessary for openshift, as websockets is restricted to this port
//========================================//
}




if( SERVER ) {
	module.exports.SERVER_IP   = SERVER_IP;
	module.exports.SERVER_PORT = SERVER_PORT;
	module.exports.MONGO_IP    = MONGO_IP;
	module.exports.MONGO_PORT  = MONGO_PORT;
}
