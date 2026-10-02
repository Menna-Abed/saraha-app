import { model, Schema} from 'mongoose'

const userSchema = new Schema(

    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: function () {
                return this.provider === 'local'; },
        },
        provider: {
            type: String,
            enum: ['local', 'google', 'facebook'],
            default: 'local'
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false// update to true after email verification
        },
        dob: Date,  //===> Optional
        gender: {
            type: String,
            enum: ['male', 'female'],
            default: 'male'// update to female after email verification
        },
       // createdAt: Date,
       // updatedAt: Date
    }  ,
     {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }})

export const User =  model('User', userSchema)