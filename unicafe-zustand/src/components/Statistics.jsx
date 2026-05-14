import useStatsStore from "../store"

const Statistics = () => {
  const good = useStatsStore((state) => state.good)
  const neutral = useStatsStore((state) => state.neutral)
  const bad = useStatsStore((state) => state.bad)
  const all = good + neutral + bad
  const average = all > 0 ? (good * 1 + neutral * 0 + bad * -1) / all : 0
  const positive = all > 0 ? (good) / all : 0

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
