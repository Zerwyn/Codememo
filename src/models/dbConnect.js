const mongodb = require('mongodb')
const { MongoClient, ObjectID} = mongodb
const hostname = 'mongodb://localhost:27017'
const dbName = 'Codememo'

module.exports = new Promise((resolve, reject) => {
    MongoClient.connect(hostname, { useUnifiedTopology: true }, (err, client) => {
        if(err) reject(err)
        resolve(client.db(dbName))
    })
})
.then(db => {
    console.log(`Connected to ${dbName}`)
    return [db,ObjectID]
})
.catch(err => {
    console.error(err)
    process.exit(1)
})