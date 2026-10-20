import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    rajaa näytettäviä: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      nimi: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      numero: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">lisää</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => (
  <div>
    {personsToShow.map(person => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => deletePerson(person.id, person.name)}>
          poista
        </button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showNotification('Tietojen haku palvelimelta epäonnistui', 'error')
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} on jo luettelossa, korvataanko vanha numero uudella?`
      )

      if (confirmUpdate) {
        const updatedObject = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Päivitettiin numero henkilölle ${returnedPerson.name}`, 'success')
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
              showNotification(error.response.data.error, 'error')
            } else {
              showNotification(
                `Henkilö '${existingPerson.name}' oli jo poistettu palvelimelta`,
                'error'
              )
              setPersons(persons.filter(p => p.id !== existingPerson.id))
            }
          })
      }
      return
    }

    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Lisättiin ${returnedPerson.name}`, 'success')
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          showNotification(error.response.data.error, 'error')
        } else {
          showNotification('Lisäys epäonnistui odottamattoman virheen vuoksi', 'error')
        }
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Poistetaanko ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Poistettiin ${name}`, 'success')
        })
        .catch(error => {
          showNotification(
            `Henkilö '${name}' oli jo valmiiksi poistettu palvelimelta`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Lisää uusi</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numerot</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App