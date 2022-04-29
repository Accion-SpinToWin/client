import React, { useState } from 'react'
import Wheel from '../components/Wheel'
import './Home.css'

export const Home = () => {
    const [rewards, setrewards] = useState(['100/- Coupon', '500/- Coupon', '1000/- Coupon', '1500/- Coupon', '2000/- Coupon', 'Spin again!', '5000/- Coupon'])
    const [selected, setSelected] = useState(null)
    return (
        <div className='home'>
            <div>
                Home content
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla nihil autem eos eum laborum, voluptatibus placeat incidunt pariatur at molestias debitis rem totam esse ipsam aspernatur sunt repellat. Ipsum, consequuntur!</div>
                <Wheel items={rewards} onSelectItem={(selected) => setSelected(selected)} selectedItem={selected} />
                {selected && <div className='selected'> 
                    <h4>You Won : {selected}</h4></div>}
            </div>
        </div>
    )
}
