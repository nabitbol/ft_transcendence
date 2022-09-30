import { render } from '@testing-library/react';

import Profil from './profil';

describe('Profil', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Profil />);
    expect(baseElement).toBeTruthy();
  });
});
