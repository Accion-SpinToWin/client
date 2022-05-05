import React, {
  // useEffect,
  useState
} from 'react'
import { Link, useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from "@fortawesome/free-solid-svg-icons";
import './Header.css'
export const Header = () => {
  const navigate = useNavigate()
  const [pathName] = useState(window.location.pathname)
  // useEffect(() => {
  //   setPathName(window.location.pathname)
  // }, [window.location.pathname])

  return (
    <div id="header-li" className="list">
      <ul>
        <li className={pathName === '/' ? 'selected-path' : ''}><Link to="/">Main</Link></li>
        <li className={pathName === '/home' ? 'selected-path' : ''}><Link to="home"> <FontAwesomeIcon icon={faAward} color={'blue'} /></Link></li>
        <li className={pathName === '/dashboard' ? 'selected-path' : ''} ><Link to="dashboard">Dashboard</Link></li>
        <li className={pathName === '/admin' ? 'selected-path' : ''}><Link to="admin">Admin</Link></li>
        {/* <li className={pathName === '/about' ? 'selected-path' : ''}><Link to="about">About</Link></li> */}

      </ul>
      <div className='last'>
        <div className='last-btn' style={{color:'black',fontWeight:'700'}} onClick={() => navigate('/')}>
        <img src='https://www.austintechnologycouncil.org/wp-content/uploads/2019/07/Accion-Logo.png' width={100} /></div>
      </div>
    </div>
  )
}
