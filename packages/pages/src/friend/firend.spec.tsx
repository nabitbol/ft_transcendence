import { render } from '@testing-library/react';

import Firend from './firend';

describe('Firend', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Firend />);
    expect(baseElement).toBeTruthy();
  });
});
