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
