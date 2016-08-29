import React, { PropTypes } from 'react';
import { select } from 'd3-selection';
import { axisLeft, axisTop, axisBottom } from 'd3-axis';

class Axis extends React.Component {

  componentDidMount() {
    // when the DOM is rendered,
    // pass control of the "g" to
    // D3 so it can draw an axis
    return this.connectD3();
  }

  componentDidUpdate() {
    // when the DOM is rendered,
    // pass control of the "g" to
    // D3 so it can draw an axis
    return this.connectD3();
  }

  connectD3() {
    const { orientation, scale, tickSizeInner, ticks } = this.props;

    const node = this.refs.axis;

    const axis = (orientation === 'left' ? axisLeft() : axisBottom())
      .tickSizeOuter(0)
      .tickSizeInner(Math.abs(tickSizeInner) * -1)
      .ticks(ticks)
      .tickPadding(10) // @TODO take this hard code out
      .scale(scale);

    return select(node).call(axis);
  }

  render() {
    const { transform } = this.props;
    return (<g transform={ transform } ref="axis"></g>);
  }
};

Axis.propTypes = {
  orientation: PropTypes.oneOf(['left', 'bottom']).isRequired,
  scale: PropTypes.func.isRequired,
  transform: PropTypes.string.isRequired,
  tickSizeInner: PropTypes.number.isRequired
};

export default Axis;
