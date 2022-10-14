import { render } from '@testing-library/react';

import Tmp from './tmp';

describe('Tmp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Tmp />);
    expect(baseElement).toBeTruthy();
  });
});
