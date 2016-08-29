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
import classnames from 'classnames';

const SIDEBAR_WIDTH = 80;
const PIN_HEIGHT = 50;
const PIN_WIDTH = PIN_HEIGHT * 0.64;

class PegboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onReset = this.onReset.bind(this);
    this.getPegsLeft = this.getPegsLeft.bind(this);
    this.onPegGrab = this.onPegGrab.bind(this);
    this.state = { valid: null };
  }

  onReset() {
    const { initBoard, pegboard } = this.props;
    initBoard({ height: 10, width: 10 });
    this.setState({ valid: null });
  }

  onCheck() {
    const { pegboard, pegs } = this.props;

    const valid = pegs.reduce((res, peg) => {
      if(!is(pegboard.getIn([peg.get('x'), peg.get('y')]), peg)) {
        return false;
      }

      return res;
    }, true);

    this.setState({ valid });
  }

  getPegsLeft() {
    const { pegboard, pegs } = this.props;

    return pegs
      .filter((peg) => !pegboard.find(pegrow => pegrow.find(peghole => is(peghole, peg))));
  }


  onPegGrab(loc) {
    const { removePeg } = this.props;
    this.setState({ valid: null });
    removePeg(loc);
  }

  render() {
    const { placePeg, pegboard, initBoard, removePeg, pegs } = this.props;
    const { valid } = this.state;

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

    const margins = { top: 50, left: 30, right: 20, bottom: 20 };

    const markerClasses = classnames({
      'fa-check': valid === true,
      'fa-times': valid === false,
      [classes.correct]: valid === true,
      [classes.wrong]: valid === false
    });

    return (
      <div className={ classes.gameContainer }>
        <div className={ classes.gameArea }>
          <Sidebar style={ { marginTop: margins.top, width: SIDEBAR_WIDTH, marginBottom: margins.bottom } } className={ classes.sideBar } width={ SIDEBAR_WIDTH }>
            {
              pegs
                .map((peg) => (
                  <Peg
                    disabled={ !this.getPegsLeft().find(pl => pl.get('id') === peg.get('id')) }
                    height={ PIN_HEIGHT }
                    width={ PIN_WIDTH }
                    peg={ peg }
                    key={ peg.get('id') }
                  />)
                )
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
            onPegGrab={ this.onPegGrab }
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
      </div>
      <div className={ classes.controls }>
        <i style={ { width: SIDEBAR_WIDTH + margins.left - 10, paddingRight: margins.left - 8} } className={`fa ${markerClasses}` }></i>
        <div style={ { width: xSize } } className={ classes.buttons }>
          <button onClick={ this.onCheck } className={'btn btn-primary' } disabled={ this.getPegsLeft().size > 0 } >Check Results</button>
          <button onClick={ this.onReset } className={'btn btn-warning' } disabled={ this.getPegsLeft().size === pegs.size }>Reset</button>
        </div>
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
