import { render } from '@testing-library/react';

import UpdateRoom from './update-room';

describe('UpdateRoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< UpdateRoom />);
    expect(baseElement).toBeTruthy();
  });
});
