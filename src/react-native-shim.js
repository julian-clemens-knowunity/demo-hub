import * as rnw from 'react-native-web';

export * from 'react-native-web';

export default function codegenNativeComponent() {
  return () => null;
}

export const TurboModuleRegistry = {
  get: () => ({
    installCoreFunctions: () => {},
  }),
  getEnforcing: () => ({
    installCoreFunctions: () => {},
  }),
};
