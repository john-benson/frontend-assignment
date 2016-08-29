export const calcXPos = (xScale, xOffset, sidebarWidth, marginLeft) => (
  Math.round(xScale.invert(xOffset - sidebarWidth - marginLeft))
)

export const calcYPos = (yScale, yOffset, marginTop) => (
  Math.round(yScale.invert(yOffset - marginTop))
)

export const inherits = () => {} ///??????
