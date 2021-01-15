const RecordTC = require('@app/module/record/types')
const resolvers = require('@app/module/record/resolvers')

for (const resolver in resolvers) {
  RecordTC.addResolver(resolvers[resolver])
}

module.exports = RecordTC
