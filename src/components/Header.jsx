import React from 'react'
import { Link, useNavigate} from 'react-router-dom';
import './Header.css'
export const Header = () => {
  const navigate  = useNavigate()
    return (
        <div className="list">
        <ul>
          <li><Link to="/">Main</Link></li>
          <li><Link to="home">Home</Link></li>
          <li><Link to="about">About</Link></li>

        </ul>
        <div className='last'>
            <div className='last-btn' onClick={()=>navigate('/')}>Logo Here!</div>
        </div>
      </div>
    )
}
