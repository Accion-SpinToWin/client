import React from 'react';
import Confetti from '../components/Confetti'

import winSound from '../utilities/mixkit-video-game-win-2016.wav'
import './Wheel.css';

export default class Wheel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItemCopy: props.selectedItem,
            selectedItem: null,
            shouldDisplayConfetti: false,
            audio: new Audio(winSound),
        };


    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ selectedItem: this.state.selectedItemCopy });
        }, 2000);
        setTimeout(() => {
            this.setState({ shouldDisplayConfetti: true });
            this.state.audio.volume = 0.5;
            this.state.audio.play()
        }, 5000)

    }


    render() {
        const { selectedItem } = this.state;
        const { items, isWinnerWheelOnSpin } = this.props;

        const wheelVars = {
            '--nb-item': items.length,
            '--selected-item': (selectedItem && selectedItem.rewardId ?
                this.props.items.findIndex(x => x.rewardId === selectedItem.rewardId) : 0),
        };
        const spinning = ((selectedItem !== null) || isWinnerWheelOnSpin) ? 'spinning' : '';

        return (
            <><div className="wheel-container"  >
                <div className={`wheel ${spinning}`} style={wheelVars}
                >
                    {Object.keys(items).map((item, index) => (
                        <div className="wheel-item" key={item.rewardId} style={{ '--item-nb': index }}>
                            {items[item].name}
                        </div>
                    ))}
                </div>
            </div><div className='selected'>
                    {this.state.shouldDisplayConfetti && selectedItem?.rewardId && <>
                        <Confetti />
                        <h4>Reward Won : {Object.keys(items).filter(x => items[x].rewardId === selectedItem?.rewardId).map(x => items[x])[0].name}</h4>
                    </>
                    }
                </div>
            </>
        );
    }
}
