import StatusPage from '../components/common/StatusPage'

function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      message="The page you're looking for doesn't exist or has moved."
    />
  )
}

export default NotFoundPage
