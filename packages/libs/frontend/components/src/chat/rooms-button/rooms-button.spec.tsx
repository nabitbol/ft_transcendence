import { render } from '@testing-library/react';

import RoomsButton from './rooms-button';

describe('RoomsButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< RoomsButton />);
    expect(baseElement).toBeTruthy();
  });
});
