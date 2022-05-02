import React from 'react';

import './Wheel.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.selectedItem,

    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {

    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {

        setTimeout(() => { this.props.onSelectItem(this.props.items[selectedItem]); }, 4000);

      }
      this.setState({ selectedItem });
    } else {
      this.setState({ selectedItem: null });
      if (this.props.onSelectItem) {
        this.props.onSelectItem(null);
      }
      setTimeout(this.selectItem, 500);
    }
  }


  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';

    return (
      <div className="wheel-container">
        <div className={`wheel ${spinning}`} style={wheelVars}
          onClick={this.selectItem} >
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
