import React from 'react'
import { Spinner } from 'react-bootstrap'

export const BusyIndicator = () => {
  return (
    <div style={{display:'flex',justifyContent:'center'}}> <Spinner animation="border" variant="primary" style={{fontSize:'40px'}} /></div>
  )
}
