import React from 'react';
import { Pegboard } from 'components/Pegboard';
import { Sidebar } from 'components/Sidebar';
import { Peg } from 'components/Peg';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classes from './game.scss';
import { SnapDragLayer } from 'components/SnapDragLayer';
import { scaleLinear } from 'd3-scale';
import { connect } from 'react-redux';
import { actions } from '../modules/pegboard';
import { is, Map } from 'immutable';

class PegboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onReset = this.onReset.bind(this);
    this.getPegsLeft = this.getPegsLeft.bind(this);
  }

  onReset() {
    const { initBoard, pegboard } = this.props;
    initBoard({ height: pegboard.size, width: pegboard.first().size })
  }

  onCheck() {
    const { pegboard, pegs } = this.props;

    if(this.getPegsLeft().length > 0) {
      return alert('You still have pegs left to place')
    }

    const res = pegs.map(peg => {
      if(!is(pegboard.getIn([peg.get('x'), peg.get('y')]), peg)) {
        return `Peg ${peg.get('id')} should be at ${peg.get('x')}, ${peg.get('y')}\n`;
      }

      return null;
    })

    alert(res.join('').trim() || 'You did it!');
  }

  getPegsLeft() {
    const { pegboard, pegs } = this.props;

    return pegs
      .filter((peg) => !pegboard.find(pegs => pegs.find(peghole => is(peghole, peg))));
  }

  render() {
    const { placePeg, pegboard, initBoard, removePeg } = this.props;

    if(!pegboard || pegboard.size === 0) {
      this.onReset();
      return null;
    }

    const growthFactor = 50;
    const yTicks = pegboard.size - 1;
    const xTicks = pegboard.first().size - 1;

    const ySize = growthFactor * yTicks;
    const xSize = growthFactor * xTicks;

    const yScale= scaleLinear()
      .domain([yTicks, 0])
      .range([0, ySize]);

    const xScale = scaleLinear()
      .domain([0, xTicks])
      .range([0, xSize]);

    const margins = { top: 50, left: 50, right: 20, bottom: 20 };

    return (
      <svg className={ classes.svg }>
        <Pegboard
          margins={ margins }
          onPegDrop={ placePeg }
          onPegGrab={ removePeg }
          className={ classes.contentArea }
          pegboard={ pegboard }
          xScale={ xScale }
          yScale={ yScale }
        />
    </svg>
  );
  }

}

const mapStateToProps = (state, props) => ({
  pegboard: state.pegboard,
  pegs: state.pegs
});

const mapDispatchToProps = {
  placePeg: actions.placePeg,
  removePeg: actions.removePeg,
  initBoard: actions.initBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(PegboardContainer));
