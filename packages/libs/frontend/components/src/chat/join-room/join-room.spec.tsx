import { render } from '@testing-library/react';

import JoinRoom from './join-room';

describe('JoinRoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< JoinRoom />);
    expect(baseElement).toBeTruthy();
  });
});
