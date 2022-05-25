import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {
  useEffect,
  useState
} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { faHouse,faDharmachakra,faGroupArrowsRotate, faUser, faAward } from "@fortawesome/free-solid-svg-icons";
import './SideNav.css';

export const SideNav=() => {
  const navigate = useNavigate()
  const [pathName, setPathName] = useState(window.location.pathname)
  useEffect(() => {
    setPathName(window.location.pathname)
  }, [window.location.pathname])
  return (
    <div className='wrapper'>
        <div 
        className={pathName === '/' ? 'navItemSelected' : 'navItem'}
        style={{marginTop: '20px'}} onClick={()=>navigate("/")}>
            <FontAwesomeIcon icon={faHouse} size='2x'/>
            Home
        </div>
        <div 
        className={pathName === '/home' ? 'navItemSelected' : 'navItem'}
        onClick={()=>navigate("/home")}>
            <FontAwesomeIcon icon={faDharmachakra} size='2x' />
            Wheel
        </div>
        <div 
        className={pathName === '/home-selection' ? 'navItemSelected' : 'navItem'}
        onClick={()=>navigate("/home-selection")}>
            <FontAwesomeIcon icon={faGroupArrowsRotate} size='2x' />
            Spin
        </div>
        <div 
        className={pathName === '/admin' ? 'navItemSelected' : 'navItem'}
        onClick={()=>navigate("/admin")}>
            <FontAwesomeIcon icon={faUser} size='2x' />
            Admin
        </div>
        <div 
        className={pathName === '/dashboard' ? 'navItemSelected' : 'navItem'}
        onClick={()=>navigate("/dashboard")}>
            <FontAwesomeIcon icon={faAward} size='2x' />
            Awards
        </div>
        <div className='navItem' 
        style={{marginTop: 'auto'}}
        >
            <img src="accion_wide.png" alt="Accion" width="83" height="22"/>
        </div>

      {/* <ul>
        <li className={pathName === '/' ? 'selected-path' : ''}><Link to="/">Main</Link></li>
        <li className={pathName === '/home' ? 'selected-path' : ''}>
            <Link to="home"> <FontAwesomeIcon icon={faHouse} color={'blue'} /></Link>
            </li>
        <li className={pathName === '/home-selection' ? 'selected-path' : ''}>
          <Link to="home-selection">
            <div><FontAwesomeIcon icon={faAward} color={'blue'}
              style={pathName === '/home-selection' ? { fontSize: '1.1rem' } : { fontSize: '0.7rem' }} />
            <FontAwesomeIcon icon={faAward} color={'black'}
              style={pathName === '/home-selection' ? { fontSize: '1.4rem' } : { fontSize: '1.1rem' }} />
            <FontAwesomeIcon icon={faAward} color={'blue'}
              style={pathName === '/home-selection' ? { fontSize: '1.1rem' } : { fontSize: '0.7rem' }} />
         </div> </Link></li>
        <li className={pathName === '/dashboard' ? 'selected-path' : ''} ><Link to="dashboard">Dashboard</Link></li>
        <li className={pathName === '/admin' ? 'selected-path' : ''}><Link to="admin">Admin</Link></li>
      </ul> */}
    </div>
  )
}
