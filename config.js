//=====================================//
//        SERVER CONFIGURATION         //
//=====================================//
  if( process.env ) {                  // TOGGLE ON FOR OPENSHIFT DEPLOY
//=====================================//
//IP ADDRESS                           //
  var SERVER_IP =                      //
//'localhost';                         // toggle on for local testing
  process.env.OPENSHIFT_NODEJS_IP;     // toggle on for openshift deploy
//=====================================//
//PORT NUMBER                          //
  var SERVER_PORT =                    //
//8080;                                // toggle on for local testing
  process.env.OPENSHIFT_NODEJS_PORT;   // toggle on for openshift deploy
//=====================================//
 }                                     // TOGGLE ON FOR OPENSHIFT DEPLOY
//=====================================//

//=====================================//
//         CLIENT CONFIGURATION        //
//=====================================//
//IP ADDRESS                           //
  var CLIENT_IP =                      //
//"localhost";                         // toggle on for local testing
  "435-teamnoname.rhcloud.com";        // toggle on for openshift deploy
//=====================================//
//PORT NUMBER                          //
  var CLIENT_PORT =                    //
//8080;                                // toggle on for local testing
  8000;                                // neccessary for openshift, as websockets is restricted to this port
//=====================================//




//server-side stuff
if( process.env ) {                          // TOGGLE ON FOR OPENSHIFT DEPLOY
	module.exports.CLIENT_IP   = CLIENT_IP;
	module.exports.CLIENT_PORT = CLIENT_PORT;
	module.exports.SERVER_IP   = SERVER_IP;
	module.exports.SERVER_PORT = SERVER_PORT;
}                                            // TOGGLE ON FOR OPENSHIFT DEPLOY
