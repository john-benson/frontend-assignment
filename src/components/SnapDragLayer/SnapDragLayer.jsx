import React from 'react';
import { DragLayer } from 'react-dnd';
import { Peg } from '../Peg';

const collect = (monitor) => ({
  isDragging: monitor.isDragging(),
  currentOffset: monitor.getClientOffset(),
  item: monitor.getItem()
});
const layerStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

class SnapDragLayer extends React.Component {

  constructor(props) {
    super(props);
    this.renderPreviewPeg = this.renderPreviewPeg.bind(this);
  }

  renderPreviewPeg() {
    const {
      isDragging, currentOffset, item, xScale, yScale, xSize, ySize, margins,
      sidebarWidth, pinHeight, pinWidth
    } = this.props;

    if(currentOffset && item.peg) {
      if( currentOffset.x <= ((sidebarWidth + margins.left) * 0.97) ||
          currentOffset.x >= ((sidebarWidth + xSize + margins.left) * 1.03) ||
          currentOffset.y <= ((margins.top) * 0.97) ||
          currentOffset.y >= ((ySize + margins.top) * 1.03) ) {
        return null;
      }

      const x = Math.round(xScale.invert(currentOffset.x - sidebarWidth - margins.left));
      const y = Math.round(yScale.invert(currentOffset.y - margins.top));

      const style = {
        position:'absolute',

        top: `${yScale(y) + margins.top - pinHeight}px`,

        left: `${xScale(x) + margins.left - (pinWidth/2) + sidebarWidth}px`
      };

      return <Peg width={ pinWidth } height={ pinHeight } placed={ true } peg={ item.peg } style={ style }/>;
    }

    return null;
  }

  render() {
    return (<div style={ layerStyles }>
      { this.renderPreviewPeg() }
    </div>);
  }
}

export default DragLayer(collect)(SnapDragLayer);
