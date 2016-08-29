import React, { Component } from 'react'
import Peg from 'components/Peg/Peg'
import { shallow, mount } from 'enzyme'
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import { Map } from 'immutable';

function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    class TestContextContainer extends Component {
      render() {
        return <DecoratedComponent {...this.props} />;
      }
    }
  );
}

describe('(Presentation) Peg', () => {
  it('should render a div show the peg\'s id, and xy coords when not placed', () => {
    const mockPeg = Map({ id: '1', x: 5, y: 2 });

    const WrappedPeg = wrapInTestContext(Peg);

    const wrapper = mount(<WrappedPeg peg={ mockPeg } height={ 40 } width={ 28 } />);

    expect(wrapper.find('.pegInfo').text()).to.be.equal('x:5, y:2');
    expect(wrapper.find('span').text()).to.be.equal('1');
  });

  it('should render a div show the peg\'s id only when the icon is placed', () => {
    const mockPeg = Map({ id: '1', x: 5, y: 2 });

    const WrappedPeg = wrapInTestContext(Peg);

    const wrapper = mount(<WrappedPeg peg={ mockPeg } height={ 40 } width={ 28 } placed={ true } />);

    expect(wrapper.contains('.pegInfo')).to.be.false;
    expect(wrapper.find('span').text()).to.be.equal('1');
  });
})
