import { render } from '@testing-library/react';

import Socket from './socket';

describe('Socket', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Socket />);
    expect(baseElement).toBeTruthy();
  });
});
