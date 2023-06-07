import { Card } from "react-bootstrap"

const HighComp = (WrappedComponent) => {
  return (
    <Card>
      <Card.Header>
          <Card.Title>Departments</Card.Title>
      </Card.Header>
      <Card.Body>
        <WrappedComponent />
      </Card.Body>
    </Card>
  )
}

const Home = (() => {
  return(
    <>
      <h2>Anonymous</h2>
    </>
  )
})

// export default function Perm(){
//   return HighComp(<Home/>)
// }

