## Strategy
- for the grid: render the SVG manually, as well as any fluff we want to add to it
  let d3 render the axis lines and bars; this was done by rendering the <g> tag that would host
  the x and y axises and calling the d3 code in componentDidMount and componentDidUpdate.
  we use the d3 scales to manage where we should draw things like the red circles on the SVG

- to render the Pegs (which are HTML and cannot live in an SVG); overlay an absolute positioned div
  that is used to show a floating html peg. again; using the d3 x and y scale functions, we can calculate
  where the Peg should be drawn on the grid by factoring in the width / height of the sidebar, margins,
  and peg.

- this means we MUST known the dimensions of all surrounding content so  we can show our previews

- we can use the same logic to figure out which "peghole" a user dropped a peg nearest; using the invert
  function of a scale + Math.round, we calculate the nearest peghole to where the user's mouse is (again, using
  the fact we know the dimensions).

- drag preview is the same idea, but here we must draw it using a DragLayer. Same concept as
  the pegs that are dropped (calculate closest X Y; account for dimensions of things; show a peg)

- things can go a little haywire if you for example open or close the dev console mid drag.

- I looked at rendering everything as an SVG; but react is missing some SVG support so that wasn't ideal.
