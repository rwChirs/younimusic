import { Component } from 'react';
import { View } from '@tarojs/components';

export default class RpxLine extends Component {
  static defaultProps = {
    height: 1,
    color: 'rgba(0, 0, 0, 0.1)',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { height, color } = { ...this.props };
    return (
      <View
        style={`height: ${height}px; background: ${color}; transform: scaleY(0.5);`}
      />
    );
  }
}
