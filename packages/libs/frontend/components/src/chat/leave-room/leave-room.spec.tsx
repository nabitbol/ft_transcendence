import { render } from '@testing-library/react';

import LeaveRoom from './leave-room';

describe('LeaveRoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< LeaveRoom />);
    expect(baseElement).toBeTruthy();
  });
});
