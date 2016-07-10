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

const SIDEBAR_WIDTH = 80;
const PIN_HEIGHT = 50;
const PIN_WIDTH = PIN_HEIGHT * 0.64;

class PegboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onReset = this.onReset.bind(this);
    this.getPegsLeft = this.getPegsLeft.bind(this);
  }

  onReset() {
    const { initBoard, pegboard } = this.props;
    initBoard({ height: 10, width: 10 })
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
      .filter((peg) => !pegboard.find(pegrow => pegrow.find(peghole => is(peghole, peg))));
  }

  render() {
    const { placePeg, pegboard, initBoard, removePeg, pegs } = this.props;

    if(!pegboard || pegboard.size === 0) {
      this.onReset();
      return null;
    }

    const growthFactor = 50;
    const xTicks = pegboard.size - 1;
    const yTicks = pegboard.first().size - 1;

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
      <div className={ classes.gameContainer }>
        <Sidebar className={ classes.sideBar } width={ SIDEBAR_WIDTH }>
          {
            this.getPegsLeft()
              .map((peg) => <Peg height={ PIN_HEIGHT } width={ PIN_WIDTH } onPegGrab={ removePeg } peg={ peg } key={ peg.get('id') } />)
          }
        </Sidebar>
        <SnapDragLayer
          margins={ margins }
          xScale={ xScale }
          yScale={ yScale }
          xSize={ xSize }
          ySize={ ySize }
          pinWidth={ PIN_WIDTH }
          pinHeight={ PIN_HEIGHT }
          sidebarWidth={ SIDEBAR_WIDTH }
        />
        <Pegboard
          margins={ margins }
          onPegDrop={ placePeg }
          onPegGrab={ removePeg }
          className={ classes.contentArea }
          pegboard={ pegboard }
          xScale={ xScale }
          yScale={ yScale }
          xTicks={ xTicks }
          yTicks={ yTicks }
          xSize={ xSize }
          ySize={ ySize }
          pinWidth={ PIN_WIDTH }
          pinHeight={ PIN_HEIGHT }
          sidebarWidth={ SIDEBAR_WIDTH }
        />
      <div>
        <button disabled={ this.getPegsLeft().size > 0 } onClick={ this.onCheck } >Check Results</button>
        <button disabled={ this.getPegsLeft().size === pegs.size } onClick={ this.onReset }>Reset</button>
      </div>
    </div>
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
