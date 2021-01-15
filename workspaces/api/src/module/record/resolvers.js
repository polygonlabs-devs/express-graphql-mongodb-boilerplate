Object.defineProperties(Date, {
  MIN_VALUE: {
    value: -8640000000000000 // A number, not a date
  },
  MAX_VALUE: {
    value: 8640000000000000
  }
})

const RecordModel = require('@app/module/record/record')

const record = {
  name: 'record',
  type: 'Record!',
  args: {
    name: 'String!'
  },
  resolve: async ({ args: { name } }) => {
    try {
      const record = await RecordModel.findOne({ name })
      if (!record) {
        return Promise.reject(new Error('Record not found.'))
      }

      return record
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const records = {
  name: 'records',
  type: '[Record!]',
  args: {
    start: 'Date',
    end: 'Date',
    desc: {
      type: 'Boolean',
      default: false
    }
  },
  resolve: async ({ args: { start, end, desc } }) => {
    try {
      const records = await RecordModel.find({
        createdAt: { $gte: start || Date.MIN_VALUE, $lt: end || Date.MAX_VALUE }
      }).sort({
        createdAt: desc ? -1 : 1
      })

      return records
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const addRecord = {
  name: 'addRecord',
  type: 'Record!',
  args: {
    name: 'String!',
    descr: 'String',
    thumbnail: 'String',
    layout: 'String!'
  },
  resolve: async ({ args: { name, descr, thumbnail, layout } }) => {
    try {
      const recordExist = await RecordModel.recordExist(name)
      if (recordExist) {
        return Promise.reject(new Error('Record name has already been taken.'))
      }

      const record = await new RecordModel({
        name,
        descr,
        thumbnail,
        layout
      }).save()

      return record
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateRecord = {
  name: 'updateRecord',
  type: 'Record!',
  args: { name: 'String!', descr: 'String', thumbnail: 'String', layout: 'String' },
  resolve: async ({ args: { name, descr, thumbnail, layout } }) => {
    try {
      const record = await RecordModel.findOne({ name })
      if (!record) {
        return Promise.reject(new Error('Record not found.'))
      }

      if (descr !== undefined) {
        record.descr = descr
      }

      if (thumbnail !== undefined) {
        record.thumbnail = thumbnail
      }

      if (layout !== undefined) {
        record.layout = layout
      }

      await record.save()

      return record
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const deleteRecord = {
  name: 'deleteRecord',
  type: 'Record!',
  args: {
    name: 'String!'
  },
  resolve: async ({ args: { name } }) => {
    try {
      const record = await RecordModel.findOne({ name })
      const recordExist = await RecordModel.recordExist(name)
      if (!recordExist) {
        return Promise.reject(new Error('Record not found.'))
      }

      await RecordModel.deleteOne({ name })

      return record
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const copyRecord = {
  name: 'copyRecord',
  type: 'Record!',
  args: { sourceName: 'String!', targetName: 'String!' },
  resolve: async ({ args: { sourceName, targetName } }) => {
    try {
      const srcRecordExist = await RecordModel.recordExist(sourceName)
      if (!srcRecordExist) {
        return Promise.reject(new Error('Record not found.'))
      }

      const tgtRecordExist = await RecordModel.recordExist(targetName)
      if (tgtRecordExist) {
        return Promise.reject(new Error('Record name has already been taken.'))
      }

      const srcRecord = await RecordModel.findOne({ name: sourceName })
      const tgtRecord = await new RecordModel({
        name: targetName,
        descr: srcRecord.descr,
        thumbnail: srcRecord.thumbnail,
        layout: srcRecord.layout
      }).save()

      return tgtRecord
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = {
  record,
  records,
  addRecord,
  updateRecord,
  deleteRecord,
  copyRecord
}
