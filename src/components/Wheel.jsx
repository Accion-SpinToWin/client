import React from 'react';

import './Wheel.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.selectedItem,
      selectedItemIndex: 0

    };

    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {

    if (this.state.selectedItem === null) {
      let selectedItem = Math.floor(Math.random() * this.props.items.length);
      while (this.props.items[selectedItem].units <= 0) {
        selectedItem = Math.floor(Math.random() * this.props.items.length);
      }
      if (this.props.onSelectItem) {
        this.props.onSelectItem(this.props.items[selectedItem]);
        // setTimeout(() => { this.props.onSelectItem(this.props.items[selectedItem]); }, 4000);

      }
      this.setState({ selectedItem, selectedItemIndex: selectedItem });
    } else {
      this.setState({ selectedItem: null });
      if (this.props.onSelectItem) {
        this.props.onSelectItem(null);
      }
      setTimeout(this.selectItem, 500);
    }
  }


  render() {
    const { selectedItem, selectedItemIndex } = this.state;
    const { items, isWinnerWheelOnSpin } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': (selectedItem && selectedItem.rewardId ? this.props.items.findIndex(x=>x.rewardId === selectedItem.rewardId) : selectedItemIndex),
    };
    const spinning = ((selectedItem !== null) || isWinnerWheelOnSpin) ? 'spinning' : '';

    return (
      <div className="wheel-container">
        <div className={`wheel ${spinning}`} style={wheelVars}
          onClick={this.selectItem} >
          {Object.keys(items).map((item, index) => (
            <div className="wheel-item" key={item.rewardId} style={{ '--item-nb': index }}>
              {items[item].name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
