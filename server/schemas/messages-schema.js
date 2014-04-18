var mongoose = require( 'mongoose' );
var schema = mongoose.Schema

// Create a schema for our data
var MessageSchema = new Schema ( {
sessionId { type: String, required true},
message:  { type: String, required: true },
date:     { type: Date}
});

// Use the schema to register a model with MongoDb
module.exports = mongoose.model( 'Message', MessageSchema )
