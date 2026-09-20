import mongoose from 'mongoose'
import {config} from 'dotenv';

config();
await mongoose.connect(process.env.MONGODB_URL)