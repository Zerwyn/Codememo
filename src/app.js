const express=require('express')

const app=express()
const port=8080

const startServer = (async () => {
    const [db,ObjectID] = await require('./models/dbConnect.js')
    const logRequest=require('./middlewares/logRequest.js')
    const routerMemos=require('./routes/memos.js')(db,ObjectID)
    const routerAPI=require('./routes/codememoApi.js')(db,ObjectID)
    
    app.use(express.static('./public'))
    app.use(logRequest)
    app.use(routerMemos)
    app.use(routerAPI)

    app.listen(port,()=>{
        console.log(`Server listening on http://localhost:${port}`)
    })
})()