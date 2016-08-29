import React from 'react';
import scss from './Sidebar.scss';
import classnames from 'classnames';

const Sidebar = ({ children, className, width, ...props }) => {
  const finalClassName = classnames(
    className,
    scss.sidebar
  );

  return (<div style={ { width } } className={ finalClassName } {...props}>
    { children }
  </div>)
};

export default Sidebar;
