import React from 'react'
import { Col, Row } from 'react-bootstrap'

export const Main = () => {
  return (
    <div>
      <Row>
        <Col style={{textAlign:'right'}}> <span style={{ background: 'white', color: 'black', fontSize: '30px' }}>
        Congratulations on your moment!
        </span> 
        </Col>
        <Col ><span style={{ background: 'black', color: 'white', fontSize: '30px' }}>
          Lets celebrate it with some fun!
        </span></Col>
      </Row>
    </div>)

}
