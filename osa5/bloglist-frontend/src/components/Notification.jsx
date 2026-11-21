import { Alert } from './StyledElements'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert $type={notification.type}>
      {notification.message}
    </Alert>
  )
}

export default Notification