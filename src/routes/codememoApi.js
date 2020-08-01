const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const router = express.Router()
const jsonParser = bodyParser.json()

module.exports = (db,ObjectID) =>{
    router.post('/codememo', jsonParser, (req,res) => {
        const { body: entryJson } = req

        db.collection('memos').insertOne(entryJson, (err, answer) =>{
            const [snippet] = answer.ops
            snippet.id = snippet._id
            delete snippet._id
            res.json(snippet)
        })
    })

    router.get('/codememo/:id', (req,res) => {
        const { params : {id} } = req
        db.collection('memos').findOne({ _id : new ObjectID(id) }, (err, memo) => {
            res.json(memo)
        })
    })

    router.route('/edit/:id')
    .get((req,res) => {
        const { params : {id} } = req
        res.sendFile(path.resolve('public/editor.html'))
    })
    .patch(jsonParser,(req,res) => {
        const { params : {id} , body : memo } = req

        // upsert : false ===> insert doc if doesn't exist
        db.collection('memos').updateOne({ _id : new ObjectID(id) }, { $set : memo}, { upsert : true }, (err) => {
            if(err) console.error(err)
            res.send(`${id} updated`)
        })
    })
    .delete((req,res) => {
        const { params : { id } } = req
        db.collection('memos').deleteOne({ _id : new ObjectID(id) }, (err) =>{
            if(err) console.error(err)
            res.send(`${id} deleted`)
        })
    })

    return router
}