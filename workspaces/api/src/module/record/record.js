const mongoose = require('@app/mongoose')

const { Schema } = mongoose

const recordSchema = new Schema(
  {
    name: String,
    descr: String,
    thumbnail: String,
    layout: Schema.Types.Mixed
  },
  { timestamps: true }
)

recordSchema.statics.recordExist = async function (name) {
  return await this.findOne({ name })
}

const Record = mongoose.model('Record', recordSchema)

module.exports = Record
