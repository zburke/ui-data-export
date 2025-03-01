import React from 'react';
import { noop } from 'lodash';

const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: component => component,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn(() => true),
  locale: 'en-US',
  logger: {
    log: () => { },
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: noop,
  setCurrency: noop,
  setLocale: noop,
  setSinglePlugin: noop,
  setTimezone: noop,
  setToken: noop,
  store: {
    getState: noop,
    dispatch: noop,
    subscribe: noop,
    replaceReducer: noop,
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
  ...otherProperties,
});

jest.mock('@folio/stripes/core', () => {
  const STRIPES = buildStripes();

  // eslint-disable-next-line react/prop-types
  const stripesConnect = Component => ({ mutator, resources, stripes, ...rest }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest).reduce((acc, mutatorName) => {
      const returnValue = Component.manifest[mutatorName].records ? [] : {};

      acc[mutatorName] = {
        GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
        PUT: jest.fn().mockReturnValue(Promise.resolve()),
        POST: jest.fn().mockReturnValue(Promise.resolve()),
        DELETE: jest.fn().mockReturnValue(Promise.resolve()),
        reset: jest.fn(),
      };

      return acc;
    }, {});

    const fakeResources = resources || Object.keys(Component.manifest).reduce((acc, resourceName) => {
      acc[resourceName] = {
        records: [],
      };

      return acc;
    }, {});

    const fakeStripes = stripes || STRIPES;

    // eslint-disable-next-line react/prop-types
    return (
      <Component
        {...rest}
        mutator={fakeMutator}
        resources={fakeResources}
        stripes={fakeStripes}
      />
    );
  };

  const withStripes = Component => ({ stripes, ...rest }) => {
    const fakeStripes = stripes || STRIPES;

    return (
      <Component
        {...rest}
        stripes={fakeStripes}
      />
    );
  };

  const useStripes = () => STRIPES;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  const IfPermission = props => <>{props.children}</>;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  const AppContextMenu = props => <>{props.children()}</>;

  STRIPES.connect = stripesConnect;

  return {
    ...jest.requireActual('@folio/stripes/core'),
    stripesConnect,
    withStripes,
    IfPermission,
    AppContextMenu,
    useStripes,
  };
}, { virtual: true });

export default buildStripes;
