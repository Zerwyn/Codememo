const express=require('express')
const path=require('path')
const router=express.Router()

module.exports = (db,ObjectID) => {
    // export DB
    router.get('/codememos', (req, res) => {
        db.collection('memos').find({}).toArray((err, docs) => {
            res.json(docs)
        })
    })

    router.get('/codememoNames', (req,res) => {
        db.collection('memos').find({}, {title:1}).toArray((err, docs) => {
            docs.map(elt => {
                elt.id = elt._id
                delete elt._id
                return elt
            })
            res.json(docs)
        })
    })

    router.get('/codememos/:id', (req,res) => {
        const { params : {id} } = req
        // send ejs with loaded snippets => to color syntax with prettify
        db.collection('memos').findOne({ _id : new ObjectID(id) }, (err, codememo) => {
            if(err) return res.sendFile(path.resolve('public/index.html'))
            res.render(path.resolve('public/codememo.ejs'), {codememo})
        })
    })
    
    return router;
}