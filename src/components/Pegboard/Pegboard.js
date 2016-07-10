import React from 'react';
import scss from './Pegboard.scss';
import classnames from 'classnames';
import Axis from '../Axis';
import { Range } from 'immutable';
import { DropTarget } from 'react-dnd';
import { PEG_TYPE } from '../Peg';
import { findDOMNode } from 'react-dom';
import { Peg } from '../Peg';
import { scaleLinear } from 'd3-scale';

const target = {
  drop: (props, monitor, component) => {
    const xScale = component.getXScale();
    const yScale = component.getYScale();

    const offset = monitor.getClientOffset();
    const targetRect = findDOMNode(component).getBoundingClientRect();

    const x = Math.round(xScale.invert(offset.x - targetRect.left - props.margins.left));
    const y = Math.round(yScale.invert(offset.y - targetRect.top - props.margins.top));

    const peg = monitor.getItem().peg;

    if(peg.currentPos) {
      props.onPegGrab(peg.currentPos)
    }

    props.onPegDrop({ x, y, peg });
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const GROWTH_FACTOR = 50;

class Pegboard extends React.Component {

  pegColor(x, y) {
    const { pegboard, isOver } = this.props;

    if(pegboard.getIn([x, y])) {
      return 'green';
    }

    return isOver ? 'red' : 'grey';
  }

  pegRadius(x, y) {
    const { pegboard, isOver } = this.props;

    return isOver || pegboard.getIn([x, y]) ? '5' : '3';
  }

  getYSize() {
    return this.getYTicks() * GROWTH_FACTOR;
  }

  getXSize() {
    return this.getXTicks() * GROWTH_FACTOR;
  }

  getXTicks() {
    const { pegboard } = this.props;
    return pegboard.size - 1;
  }

  getYTicks() {
    const { pegboard } = this.props;
    return pegboard.first().size - 1;
  }

  getXScale() {
    return scaleLinear()
      .domain([0, this.getXTicks()])
      .range([0, this.getXSize()]);
  }

  getYScale() {
    return scaleLinear()
      .domain([this.getYTicks(), 0])
      .range([0, this.getYSize()]);
  }

  render() {
    const {
      connectDropTarget, className, isOver, margins, pegboard, onPegGrab, ...props
    } = this.props;

    const finalClassName = classnames(
      className, scss.pegBoard
    );

    const yTicks = this.getYTicks();
    const xTicks = this.getXTicks();

    const ySize = this.getYSize();
    const xSize = this.getXSize();

    const yScale= this.getYScale();
    const xScale = this.getXScale();

    return connectDropTarget(
      <g transform={ `translate(${margins.left},${margins.top})`}>
        {
          // immutable ranges are inclusive at the start
          // exclusive at the end
          Range(0, xTicks + 1).map(xNum => (
            Range(0, yTicks + 1).map(yNum => (
              <circle
                opacity="1"
                r={ this.pegRadius(xNum, yNum) }
                cx={ xScale(xNum) }
                cy={ yScale(yNum) }
                fill={ this.pegColor(xNum, yNum) }
              />
            ))
          ))
        }
        <Axis
          orientation="bottom"
          scale={ xScale }
          transform={ `translate(0, ${ySize})` }
          tickSizeInner={ ySize }
          ticks={ xTicks }
        />
        <Axis
          orientation="left"
          scale={ yScale }
          transform={ `translate(0, 0)` }
          tickSizeInner={ xSize }
          ticks={ yTicks }
        />
      </g>
    );
  }
}

export default DropTarget(PEG_TYPE, target, collect)(Pegboard);
