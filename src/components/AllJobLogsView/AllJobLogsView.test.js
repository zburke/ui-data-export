import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
// import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { AllJobLogsViewComponent } from '.';
import { translationsProperties } from '../../../test/helpers';
import { SettingsComponentBuilder } from '../../../test/jest/helpers';
// import translations from '../../../translations/ui-data-export/en';
import { logJobExecutions } from '../../../test/bigtest/network/scenarios/fetch-job-executions-success';

const renderAllJobLogsViewContainer = () => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <AllJobLogsViewComponent
        resources={buildResources({
          resourceName: 'jobExecutions',
          records: logJobExecutions,
        })}
        mutator={buildMutator()}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('AllJobLogsView', () => {
  it('should display logs list', () => {
    renderAllJobLogsViewContainer();

    expect(screen.getByText(/logs/));
    expect(screen.getByText(/searchResultsCountHeader/)).toBeVisible();
  });

  it('should be sorted by "completedDate" descending', () => {
    renderAllJobLogsViewContainer();

    const searchResults = document.querySelectorAll('[aria-sort=descending]');

    searchResults.forEach(el => expect(el).toBeVisible());
  });

  it('should render list columns', () => {
    renderAllJobLogsViewContainer();

    expect(screen.getByText(/jobExecutionHrId/)).toBeVisible();
    expect(screen.getByText(/total/)).toBeVisible();
    expect(screen.getByText(/runBy/)).toBeVisible();
    expect(screen.getByText(/failed/)).toBeVisible();
  });

  describe('clicking on status column header', () => {
    it('should have the correct query in path', () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('button', { name: /status/i }));

      expect(decodeURIComponent(window.location.search)).toContain('?sort=status,completedDate');
    });
  });

  describe('clicking on file name with error flow', () => {
    it('should show error notification', async () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('gridcell', { name: 'import-1.mrc' }));

      expect(screen.getByRole('gridcell', { name: /fail/ })).toBeVisible();
    });
  });
});
