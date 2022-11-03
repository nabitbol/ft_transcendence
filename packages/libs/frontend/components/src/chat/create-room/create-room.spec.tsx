import { render } from '@testing-library/react';

import CreateRoom from './create-room';

describe('CreateRoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< CreateRoom />);
    expect(baseElement).toBeTruthy();
  });
});
