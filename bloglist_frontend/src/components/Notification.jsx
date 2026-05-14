import { Notice } from './Notification.styles'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return <Notice $type={type}>{message}</Notice>
}

export default Notification
