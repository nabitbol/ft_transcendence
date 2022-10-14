import { render } from '@testing-library/react';

import RoomForm from './room-form';

describe('RoomForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< RoomForm />);
    expect(baseElement).toBeTruthy();
  });
});
