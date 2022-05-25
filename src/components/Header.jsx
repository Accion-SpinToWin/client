import React, {
  useEffect,
  // useEffect,
  useState
} from 'react'
import { Link, useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from "@fortawesome/free-solid-svg-icons";
import './Header.css'
export const Header = () => {
  const navigate = useNavigate()
  const [pathName, setPathName] = useState(window.location.pathname)
  useEffect(() => {
    setPathName(window.location.pathname)
  }, [window.location.pathname])

  return (
    <div id="header-li" className="list">
      <div style={{marginLeft: 'auto', marginRight: '20px'}}>
          <img src='https://www.austintechnologycouncil.org/wp-content/uploads/2019/07/Accion-Logo.png' width={100} /></div>
    </div>
  )
}
