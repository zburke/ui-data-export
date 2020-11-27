import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';

import { Callout } from '@folio/stripes-components';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { useProfileHandlerWithCallout } from './useProfileHandlerWithCallout';
import { CalloutContext } from '../../contexts/CalloutContext';
import {
  OverlayContainer,
  translationsProperties,
} from '../../../test/helpers';

const ContextComponent = ({ children }) => {
  const calloutRef = useRef(null);
  const [isRefInitialized, setIfRefInitialized] = useState(false);

  useEffect(() => {
    if (calloutRef.current) {
      setIfRefInitialized(true);
    }
  }, [calloutRef]);

  return (
    <>
      <CalloutContext.Provider value={calloutRef.current}>
        <OverlayContainer />
        {isRefInitialized && children}
      </CalloutContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
};

const Component = ({ hookProps }) => {
  const handleCalloutCall = useProfileHandlerWithCallout(hookProps);

  return (
    <button
      type="button"
      aria-label="Label"
      data-testid="send-callout"
      onClick={() => handleCalloutCall({ name: 'Test' })}
    />
  );
};

describe('useProfileHandlerWithCallout', () => {
  const onActionCompleteMock = jest.fn();

  const hookProps = {
    errorMessageId: 'ui-data-export.mappingProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.create.successCallout',
    onActionComplete: onActionCompleteMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display success callout', () => {
    renderWithIntl(
      <ContextComponent>
        <Component
          hookProps={{
            ...hookProps,
            onAction: jest.fn(),
          }}
        />
      </ContextComponent>,
      translationsProperties
    );
    userEvent.click(screen.getByTestId('send-callout'));

    waitFor(() => {
      const callout = document.querySelector('[data-test-callout-element]');

      expect(callout).toBeInTheDocument();
      expect(callout.classList.contains('success')).toBeTruthy();
      expect(onActionCompleteMock).toBeCalled();
    });
  });

  it('should display error callout and cancel after error', () => {
    const onActionMock = () => Promise.reject();

    renderWithIntl(
      <ContextComponent>
        <Component
          hookProps={{
            ...hookProps,
            onAction: onActionMock,
            isCanceledAfterError: true,
          }}
        />
      </ContextComponent>,
      translationsProperties
    );
    userEvent.click(screen.getByTestId('send-callout'));

    waitFor(() => {
      const callout = document.querySelector('[data-test-callout-element]');

      expect(callout).toBeInTheDocument();
      expect(callout.classList.contains('error')).toBeTruthy();
      expect(onActionCompleteMock).toBeCalled();
    });
  });

  it('should display error callout and not cancel after error', () => {
    const onActionMock = () => Promise.reject();

    renderWithIntl(
      <ContextComponent>
        <Component
          hookProps={{
            ...hookProps,
            onAction: onActionMock,
            isCanceledAfterError: false,
          }}
        />
      </ContextComponent>,
      translationsProperties
    );
    userEvent.click(screen.getByTestId('send-callout'));

    waitFor(() => {
      const callout = document.querySelector('[data-test-callout-element]');

      expect(callout).toBeInTheDocument();
      expect(callout.classList.contains('error')).toBeTruthy();
      expect(onActionCompleteMock).not.toBeCalled();
    });
  });
});
