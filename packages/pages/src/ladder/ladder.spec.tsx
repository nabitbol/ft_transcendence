import { render } from '@testing-library/react';

import Ladder from './ladder';

describe('Ladder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Ladder />);
    expect(baseElement).toBeTruthy();
  });
});
