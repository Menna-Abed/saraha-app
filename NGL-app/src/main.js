import{config} from 'dotenv';
config();

import './common/db/mongoose.js';
import express from 'express';
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/service/message.route.js";
import userRouter from "./app/user/user.route.js";
const app = express();



app.use(express.json());

//Route
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);

// global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message ,
        success: false
    });
});

app.listen(3000,()=>  console.log("Server started on port 3000"));
