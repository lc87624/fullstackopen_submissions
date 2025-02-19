import { useState } from 'react'
import './App.css'

function Statistics({stats}) {
  const good = stats.good
  const neutral = stats.neutral
  const bad = stats.bad
  if (good + neutral + bad === 0) return (
    <p>No feedback given</p>
  )
  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={good + neutral + bad}/>
          <StatisticLine text="average" value={(good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)}/>
          <StatisticLine text="positive" value={good / (good + neutral + bad) * 100 +'%'}/>
        </tbody>
      </table>
    </>
  )
}

function StatisticLine({text, value}) {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = {
    good: good,
    neutral: neutral,
    bad: bad
  }

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad + 1)}>bad</button>
        <h1>statistics</h1>
        <Statistics stats={stats}/>
      </div>
    </>
  )
}

export default App
