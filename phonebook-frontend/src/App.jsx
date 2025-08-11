import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons.js";

const Notification = ({ message }) => {
  if (!message || !message.text) {
    return null;
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  );
};


const Filter = ({ filter, handleChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input name="filter" value={filter} onChange={handleChange} />
    </div>
  );
};

const Form = ({ handleSubmit, newName, handleChange, newNumber }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>add a new</h2>
      <div>
        name: <input name="name" value={newName} onChange={handleChange} />
      </div>
      <div>
        number:{" "}
        <input name="number" value={newNumber} onChange={handleChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deleteHim }) => {
  return (
    <ul>
      {persons.map((person) => (
        <Person key={person.name} id={person.id} name={person.name} number={person.number} deleteHim={deleteHim} />
      ))}
    </ul>
  );
};

const Person = ({ id, name, number, deleteHim }) => {
  return (
    <li>
      {name} {number}
      <button onClick={() => deleteHim(id)}>delete</button>
    </li>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setNewName(value);
    } else if (name === "number") {
      setNewNumber(value);
    } else if (name === "filter") {
      setFilter(value);
    }
  };

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((p) => personObject.name === p.name);

    if (existingPerson) {
      const updatedPerson = { ...existingPerson, number: newNumber };
      personService.update(existingPerson.id, updatedPerson).then((response) => {
        console.log("Person updated", response);
        setPersons(persons.map((p) => (p.id === existingPerson.id ? response : p)));
        clearInput();
        setMessage({text: `Person ${response.name} updated`, type: 'success'});
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch((error) => {
        console.error("Failed to update person", error);
        if (error.response && error.response.status === 404) {
          setMessage({text: `Information of ${existingPerson.name} has already been removed from server`, type: 'error'});
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          setPersons(persons.filter((p) => p.id !== existingPerson.id));
        } else {
          console.error("Error deleting person:", error);
        }
      })
    } else {
      personService.create(personObject)  .then((response) => {
        console.log("Person created", response);
        setPersons(persons.concat(response));
        clearInput();
        setMessage({text: `Person ${response.name} created`, type: 'success'});
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch((error) => {
        console.error("Failed to create person", error);
      });
    }
  };

  const clearInput = () => {
    setNewName("");
    setNewNumber("");
  };
  
  const deleteHim = (id) => {
    const personToBeDeleted = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(`Delete ${personToBeDeleted.name}?`);
    if (!confirmDelete) {
      return;
    }
    
    return personService.deletePerson(id).then((response) => {
      console.log(response);
      setPersons(persons.filter((p) => p.id !== id));
      setMessage({text: `Person ${response.name} deleted`, type: 'success'});
        setTimeout(() => {
          setMessage(null)
        }, 3000)
    }).catch(error => {
      console.error("Error deleting person:", error);
    });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {message && <Notification message={message} />}
      <Filter filter={filter} handleChange={handleChange} />
      <Form
        handleSubmit={handleSubmit}
        newName={newName}
        handleChange={handleChange}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteHim={deleteHim} />
    </div>
  );
};

export default App;
