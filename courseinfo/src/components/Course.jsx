const Header = ({name}) => {
  return <h2>{name}</h2>
}

const Content = ({parts}) => {
  return (
    <>
      {parts.map(part => <Part key={part.id} part={part}/>)}
    </>
  )
}
const Part = ({part}) => {
  return <p>{part.name} {part.exercises}</p>
}

const Total = ({parts}) => {
  const total = parts.reduce((acc, part) => acc + part.exercises, 0)
  return <p><b>Number of exercises {total}</b></p>
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course