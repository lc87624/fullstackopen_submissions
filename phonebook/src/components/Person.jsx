const Person = ({ person, handlePersonRemove }) => (
  <div>
    <p>
      {person.name} {person.number}
    </p>
    <button onClick={handlePersonRemove}>delete</button>
  </div>
);

export default Person;
