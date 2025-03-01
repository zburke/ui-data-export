import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import '../../../../test/jest/__new_mock__';

import { logDOM } from '@testing-library/dom';
import JobProfilesForm from './JobProfilesForm';

jest.mock(
  '@folio/stripes-components/lib/Layer',
  () => props => props.children
);

const mappingProfilesMock = [
  { value: 'mapping_1', label: 'mapping 1' },
  { value: 'mapping_2', label: 'mapping 2' },
];

const onSubmitMock = jest.fn();

const renderJobProfileForm = ({
  onCancel = jest.fn(),
  handleSubmit = onSubmitMock,
  pristine,
  submitting,
  hasLoaded = true,
  mappingProfiles = mappingProfilesMock,
  renderWithDefault,
} = {}) => {
  const props = {
    onSubmit: handleSubmit,
    pristine,
    submitting,
    ...(!renderWithDefault && {
      onCancel,
      hasLoaded,
      mappingProfiles,
    }),
  };
  render(
    <MemoryRouter>
      <JobProfilesForm {...props} />
    </MemoryRouter>
  );
};

describe('JobProfilesForm', () => {
  it('should submit form if required fields are filled', () => {
    renderJobProfileForm();

    const nameField = screen.getByRole('textbox', { name: /name/ });
    const mappingProfileField = screen.getByRole('combobox', { name: /mappingProfile/ });
    const mappingOptions = screen.getByRole('option', { name: 'mapping 1' });

    userEvent.type(nameField, 'test name');
    userEvent.selectOptions(mappingProfileField, mappingOptions);
    userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));

    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('should show validation exception if not all required fields are filled', () => {
    renderJobProfileForm();

    const nameField = screen.getByRole('textbox', { name: /name/ });

    userEvent.type(nameField, 'test name');
    userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));

    expect(screen.getByText(/validation.enterValue/)).toBeVisible();
  });

  it('should render preloader when render with default props', async () => {
    renderJobProfileForm({
      renderWithDefault: true,
    });

    const preloader = await screen.findByTestId('preloader');

    expect(preloader).toBeVisible();
  });
});
