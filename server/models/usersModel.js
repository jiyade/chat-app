const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide the name'],
            maxlength: 20,
            minlength: 3
        },
        username: {
            type: String,
            required: [true, 'Please provide the username'],
            unique: true,
            maxlength: 20,
            minlength: 3
        },
        password: {
            type: String,
            required: [true, 'Please provide the password'],
            minlength: 8
        },
        profile: {
            type: String,
            default: 'https://thumbs2.imgbox.com/8f/05/DgatVnJe_t.jpg'
        }
    },
    { timestamps: true }
)

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userId: this._id,
            username: this.username,
            name: this.name,
            profile: this.profile
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}

userSchema.methods.comparePassword = async function (pass) {
    const isMatch = await bcrypt.compare(pass, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema)
