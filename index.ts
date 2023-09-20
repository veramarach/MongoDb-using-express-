import express,{Application,Request,Response} from "express"
import mongoose from "mongoose"

const port:number = 8000

const url:string = "mongodb://0.0.0.0:27017/class"

const app:Application = express()

interface client{
    name:string,
    email:string,
    isActive:string,
    age:number
}
interface iClient extends client,mongoose.Document{}
const schemaClient = new mongoose.Schema({
    name:
    {
        type:String
    },
    email:{
        type:String
    },
    isActive: {
        type:Boolean
    },
    age:
    {
      type:Number
    }
})
const dataModel = mongoose.model<iClient>("client",schemaClient)
app.use(express.json())
app.post("/api/v1/post-client",async (req:Request, res:Response)=> {
    try
    {
        const {name, email, isActive,age} = req.body
        if(!name || !email || !isActive || !age)
        {
          return res.status(404).json({
            message:"all field is required"
          })
        }
        const data = await dataModel.create({
            name,
            email,
            isActive,
            age
        })
        return res.status(201).json({
            message:"created successfully",
            result:data

        })

    }catch(error:any)
    {
      return res.status(404).json({
        message:error.message
      })
    }
})
app.use(express.json())
app.get("/api/v1/get-all", async(req:Request, res:Response)=> {
    try
    {
        const dataAll = await dataModel.find()
        return res.status(200).json({
            message:"all data",
            result:dataAll
        })

    }catch(error:any)
    {
       return res.status(404).json({
        message:error.message
       })
    }
})
app.use(express.json())
app.get("/api/v1/single/:id", async(req:Request, res:Response)=> {
    try
    {
        const user = await dataModel.findById(req.params.id)
        return res.status(200).json({
            message:"user found",
            result:user
        })

    }catch(error:any)
    {
      return res.status(404).json({
        message:error.message
      })
    }

})

app.put("/api/v1/update-all/:id",async(req:Request, res:Response)=> {
    if(!req.body)
    {
        return res.status(400).json({
            message:"all field required"
        })
    }
    const UserId = req.params.id
    const UpdateData:any = await dataModel.findByIdAndUpdate(UserId, req.body, {useFindModify:false}).then(data => {
       if(!data)
       {
         return res.status(404).json({
            message:"user not found",
            result:UpdateData
         })
       }else
       {
        res.send({
            message:"user updated",
            
        })
       }
       
    }).catch(err => {
        return res.status(500).json({
            message:err.message
        })
    })
})
app.delete("/api/v1/delete-user/:id", async (req:Request, res:Response)=> {
    const deleteUser = await dataModel.findByIdAndRemove(req.params.id).then(data => {
        if(!data)
        {
            return res.status(404).json({
                message:"user not found"
            })
        }else
        {
            return res.send({
                message:"user deleted successfully"
            })
        }
    }).catch(err => {
        res.status(500).send({
            message:err.message
        })
    })

})
          


mongoose.connect(url).then(()=> {
    console.log("database connected successfully")  
})
.catch((error:any)=> {
    console.log("an error occurred", error)
})
const server = app.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})
    process.on("uncaughtException",(error:Error)=> {
        console.log("stop here:uncaughtException")
        console.log(error)
        process.exit(1)
})
process.on("unhandledRejection", (reason:any)=> {
    console.log("stop here:unhandledRejection")
    console.log(reason)
    server.close(()=>{
        process.exit(1)
    })
   

})

