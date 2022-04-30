import React, { useEffect, useState } from 'react'
import { Link, useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import './Header.css'
export const Header = () => {
  const navigate = useNavigate()
  const [pathName,setPathName]  = useState(window.location.pathname)
  useEffect(() => {
    setPathName(window.location.pathname)
  }, [window.location.pathname])
  
  return (
    <div className="list">
      <ul>
        <li  className={ pathName==='/'?'selected-path':''}><Link to="/">Main</Link></li>
        <li className={ pathName==='/home'?'selected-path':''}><Link to="home"> <FontAwesomeIcon icon={faHome} color={'blue'} /></Link></li>
        <li className={ pathName==='/dashboard'?'selected-path':''} ><Link to="dashboard">Distribution Dashboard</Link></li>
        <li className={ pathName==='/admin'?'selected-path':''}><Link to="admin">Admin</Link></li>
        <li className={ pathName==='/about'?'selected-path':''}><Link to="about">About</Link></li>

      </ul>
      <div className='last'>
        <div className='last-btn' onClick={() => navigate('/')}>Logo Here!</div>
      </div>
    </div>
  )
}
