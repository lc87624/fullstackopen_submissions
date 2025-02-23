import Person from "./Person";
const Persons = ({ persons, removePersonOf }) =>
  persons.map((person) => (
    <Person
      key={person.id}
      person={person}
      handlePersonRemove={() => removePersonOf(person)}
    />
  ));

export default Persons;
