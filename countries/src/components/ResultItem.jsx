const ResultItem = ({ result, handleShowClick }) => {
  return (
    <div>
      <label>{result}</label>
      <button onClick={handleShowClick}>show</button>
    </div>
  );
};

export default ResultItem;
