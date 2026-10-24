import StatusPage from '../components/common/StatusPage'

function UnauthorizedPage() {
  return (
    <StatusPage
      code="403"
      title="You don't have access to this page"
      message="Your role doesn't include this area. If you think this is a mistake, contact your administrator."
    />
  )
}

export default UnauthorizedPage
