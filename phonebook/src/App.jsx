import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/persons";
import Notification from "./components/Notification";
import ErrorNotification from "./components/ErrorNotification";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    const personExists = persons.find((person) => person.name === newName);
    if (personExists) {
      const toReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (toReplace === false) return;
      const newPerson = {
        name: newName,
        number: newNumber,
        id: personExists.id,
      };
      personService
        .update(personExists.id, newPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person
            )
          )
          setNewName("");
          setNewNumber("");
          setMessage(`Updated ${newName}`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        }).catch(() => {
          setError(`Information of ${newName} has already been removed from server`);
          setTimeout(() => {
            setError(null);
          }, 5000);
        });
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setMessage(`Added ${newName}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
  };

  const removePersonOf = (toRemovePerson) => {
    if (window.confirm(`Delete ${toRemovePerson.name}?`) === false) return;
    personService.remove(toRemovePerson.id).then(() => {
      setPersons(persons.filter((person) => person.id !== toRemovePerson.id));
    }).catch(() => {
      setError(`Information of ${toRemovePerson.name} has already been removed from server`);
      setTimeout(() => {
        setError(null);
      }, 5000);
    });
  };

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const showPersons =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification error={error} />
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        handlePersonSubmit={handlePersonSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={showPersons} removePersonOf={removePersonOf} />
    </div>
  );
}

export default App;
