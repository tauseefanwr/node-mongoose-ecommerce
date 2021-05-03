const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://tauseefanwar:tauseefdb!23@cluster0.mcg9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    // "mongodb://localhost/shop",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database found";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
