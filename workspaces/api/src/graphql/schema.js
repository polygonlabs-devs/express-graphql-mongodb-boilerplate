const { schemaComposer } = require('graphql-compose')

require('@app/graphql/types')

const { authMiddleware: middleware } = require('@app/middleware')
const { userValidator: validator } = require('@app/validator')
const { UserTC, RecordTC } = require('@app/module')

schemaComposer.Query.addFields({
  // queries for auth
  user: UserTC.getResolver('user', [middleware.isAuth]),

  // queries for records
  record: RecordTC.getResolver('record'),
  records: RecordTC.getResolver('records')
})

schemaComposer.Mutation.addFields({
  // mutations for auth
  signIn: UserTC.getResolver('signIn', [middleware.isGuest, validator.signIn]),
  signUp: UserTC.getResolver('signUp', [middleware.isGuest, validator.signUp]),
  logout: UserTC.getResolver('logout', [middleware.isAuth]),
  verifyRequest: UserTC.getResolver('verifyRequest', [middleware.isAuth, middleware.isUnverfied]),
  verify: UserTC.getResolver('verify'),
  resetPassword: UserTC.getResolver('resetPassword', [middleware.isGuest, validator.resetPassword]),
  newPassword: UserTC.getResolver('newPassword', [middleware.isGuest, validator.newPassword]),
  changePassword: UserTC.getResolver('changePassword', [
    middleware.isAuth,
    validator.changePassword
  ]),
  updateUser: UserTC.getResolver('updateUser', [middleware.isAuth, validator.updateUser]),
  switchLocale: UserTC.getResolver('switchLocale', [middleware.isAuth]),

  // mutations for records
  addRecord: RecordTC.getResolver('addRecord'),
  updateRecord: RecordTC.getResolver('updateRecord'),
  deleteRecord: RecordTC.getResolver('deleteRecord'),
  copyRecord: RecordTC.getResolver('copyRecord')
})

const schema = schemaComposer.buildSchema()

module.exports = schema
