import { render } from '@testing-library/react';

import Rooms from './rooms';

describe('Rooms', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Rooms />);
    expect(baseElement).toBeTruthy();
  });
});
