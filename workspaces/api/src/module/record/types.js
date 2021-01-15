const { composeWithMongoose } = require('graphql-compose-mongoose')

const RecordModel = require('@app/module/record/record')

const RecordTC = composeWithMongoose(RecordModel)

module.exports = RecordTC
