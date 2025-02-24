const ErrorNotification = ({ error }) => {
  if (error === null) {
    return null;
  }
  const notificationStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return <div style={notificationStyle}>{error}</div>;
};

export default ErrorNotification;