import React from 'react';
import Confetti from '../components/Confetti'
import './Wheel.css';
export default class WheelHR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: props.selectedItem,
            isWheelBusyHRMode: true,
            shouldDisplayConfetti: false
        };
    }

    componentDidMount() {
        this.state.selectedItem && setTimeout(() => {
            this.setState({ isWheelBusyHRMode: false })
        }, 4000);
        this.state.selectedItem && setTimeout(() => {
            this.setState({ shouldDisplayConfetti: true })
        }, 5000)
    }

    render() {
        const { selectedItem, } = this.state;
        const { items } = this.props;

        const wheelVars = {
            '--nb-item': items.length,
            '--selected-item': selectedItem ? (this.props.items.findIndex(x => x.rewardId === selectedItem.rewardId)) : 0,
        };
        const spinning = this.state.isWheelBusyHRMode ? 'spinningHR' : '';

        return (<>
            <div className="wheel-container">
                <div className={`wheel ${spinning}`} style={wheelVars}
                >
                    {Object.keys(items).map((item, index) => (
                        <div className="wheel-item" key={item.rewardId} style={{ '--item-nb': index }}>
                            {items[item].name}
                        </div>
                    ))}
                </div>
            </div>
            <div className='selected'>
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
