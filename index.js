import Express from "express";
import mongoose from "mongoose";
import customer from "./model.js";

const app = Express();
app.use(Express.json());
const CONNECTION_URL = 'mongodb://127.0.0.1:27017/customerdetails?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4'


app.use('/createcustomer',async(req, res)=>{
    //dynamic
    var data = await req.body;
    customer.create(data);
    res.status(200).json(data);

});
app.use('/insertmanycustomers',async (req, res)=>{
  var data = await req.body;
  customer.insertMany(data);
  res.status(200).json(data);
})
    // const data = model.create({
    //     cname: "sheeba",
    //     email: "sheebashiny@gmail.com",
    //     Dob : new Date("1996-07-21"),
    //     age: 27,
    //     salary: 25000,
    //     Did: 1,
    //     designation:'UI developer',
    //     pincode: 625016,
    //     pancard: "ACV09345",
    //     mobileNo: 9087879089,
    //     cstatus: 0,
    //     AuthKey:""
    // });
//     res.status(200).json(data)
// })

  app.use('/getallcustomer',async (req,res)=>{
    try {
      var data = await customer.find();
      res.send(data);
    } catch (error) {
      res.status(400).json(error.msg)
    }
  })

  app.use('/selectcustomer',async (req,res)=>{
    try{
      var data = await customer.find({cname: req.body.name, email: req.body.email});
      res.send(data);
    }catch(error)
    {
      res.status(200).json(error.msg)
    }  
  })
  app.use('/update',async (req,res)=>{
    try{
       let data = await customer.updateOne({cname: req.params.cname},
        {
        $set: {
          email: req.body.email
          
        } 
       });  
      res.send(data);
    }catch(error)
    {
      res.status(400).json(error.msg)
    }  
  })
//update many:

  app.use('/updateall/:cname',async (req,res)=>{
    let data = await customer.updateMany(
      {},
      {
        $set: {
          salary: req.body.salary,
        },
      }
    )
    res.status(200).json(data);
  })

  // delete single customer:

  app.use('/removecustomer',async (req,res)=>{
      await customer.findByIdAndDelete({_id: req.params.id}).
      then(res.send('customer data deleted successfully'))
  })

  app.get('*',function(req,res){
    res.send('sorry this is iinvalid URL');
  });

//login

  app.use('/login',async(req,res)=>{
    var data = await customer.findOne({$and:[{"cname":req.body.name},
    {"mobileNo":req.body.mobileno}]
    });
    if(data){
      res.status(200).json({message: "Login success", status:1});
    }
    else{
      res.status(200).json({message: "Login failure", status:0});
    }
  });

  //reset password

  app.use("/resetpswd", async (req, res) => {
    let data = await customer.updateOne(
      { email: req.params.email },
      { oldpassword: req.params.oldpassword},
      {
        $eq: [
          {
          //   oldpassword: request.body.oldpassword,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
          },
        ],
        $set: [
          {
            newpassword: req.body.newpassword,
          },
        ],
      }
    );
    if (data) {
      res.status(200).json({ message: "password changed", status: -1 });
    } else {
      res.status(200).json({ message: "failed", status: 0 });
    }
  });

  mongoose.connect(CONNECTION_URL)
  .then(()=>{
    app.listen(3030,()=>{console.log("success on running...!")})
  })
  .catch((error) =>{
    console.log(error)
  })


