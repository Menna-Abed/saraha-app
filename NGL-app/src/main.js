import{config} from 'dotenv';
config();

import './common/db/mongoose.js';
import express from 'express';
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/service/message.route.js";
import userRouter from "./app/user/user.route.js";
import {logger} from "./common/logger/logger.js";
const app = express();
import cors from "cors";


app.use(express.json());

app.use(cors({origin:'http://localhost:4200'}));

//Route
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);

// global error handler
app.use((err, req, res, next) => {
   logger.error(err.message,err);
    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,

        });
    }
    return res.status(500).json({
        message: 'Something went wrong',
        success: false,
    });

});

app.listen(3000,()=> logger.info("Server started on port 3000"));
