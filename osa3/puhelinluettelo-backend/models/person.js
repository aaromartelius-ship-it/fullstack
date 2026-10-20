const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Nimen on oltava vähintään 3 merkkiä pitkä'],
    required: [true, 'Nimi on pakollinen']
  },
  number: {
    type: String,
    minlength: [8, 'Puhelinnumeron on oltava vähintään 8 merkkiä pitkä'],
    required: [true, 'Puhelinnumero on pakollinen'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} ei ole kelvollinen puhelinnumero! Muodon tulee olla esim. 09-1234556 tai 040-22334455.`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)