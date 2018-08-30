let mongoose = require('mongoose')
let Schema = mongoose.Schema

let SchoolTermSchema = new Schema({
    termTitle: String,
    termStart: Date,
    termEnd: Date,
    teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
    },
    students: [{
        type: Schema.ObjectId,
        ref:'Student'
    }]
})

//fixes the pushAll error
mongoose.plugin(schema => {
    schema.options.usePushEach = true })

module.exports = mongoose.model('SchoolTerm',
    SchoolTermSchema, 'SchoolTerm')