import React from 'react';
import { View } from 'react-native-web';

export const SafeAreaView = ({ children, style, edges, ...rest }) => {
  const padding = {
    paddingTop: edges?.includes('top') ? 'env(safe-area-inset-top, 16px)' : 0,
    paddingBottom: edges?.includes('bottom') ? 'env(safe-area-inset-bottom, 16px)' : 0,
    paddingLeft: edges?.includes('left') ? 'env(safe-area-inset-left, 0px)' : 0,
    paddingRight: edges?.includes('right') ? 'env(safe-area-inset-right, 0px)' : 0,
  };
  return (
    <View style={[padding, style]} {...rest}>
      {children}
    </View>
  );
};

export const SafeAreaProvider = ({ children }) => children;

export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

export const SafeAreaInsetsContext = React.createContext({ top: 0, bottom: 0, left: 0, right: 0 });

export default { SafeAreaView, SafeAreaProvider, useSafeAreaInsets, SafeAreaInsetsContext };
