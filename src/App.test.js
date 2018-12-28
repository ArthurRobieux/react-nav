import React from 'react';
import ReactDOM from 'react-dom';
import CalendarApp from './CalendarApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CalendarApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
