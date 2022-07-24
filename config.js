//enter the database uri here
// NOTE: select node 2.2.12 when getting uri from mongodb atlas
// otherwise it may throw an error
const dbURI = "mongodb://test1:test123@ac-cap3y9c-shard-00-00.sgscoac.mongodb.net:27017,ac-cap3y9c-shard-00-01.sgscoac.mongodb.net:27017,ac-cap3y9c-shard-00-02.sgscoac.mongodb.net:27017/?ssl=true&replicaSet=atlas-2o2pb0-shard-0&authSource=admin&retryWrites=true&w=majority";

module.exports.dbURI = dbURI;