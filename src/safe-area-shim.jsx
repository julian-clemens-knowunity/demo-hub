import React from 'react';
import { View } from 'react-native-web';

export const SafeAreaView = ({ children, style, edges, ...rest }) => {
  // Native default: when `edges` is omitted, all four sides get insets.
  const effective = edges ?? ['top', 'bottom', 'left', 'right'];
  const padding = {
    paddingTop: effective.includes('top') ? 'env(safe-area-inset-top, 16px)' : 0,
    paddingBottom: effective.includes('bottom') ? 'env(safe-area-inset-bottom, 16px)' : 0,
    paddingLeft: effective.includes('left') ? 'env(safe-area-inset-left, 0px)' : 0,
    paddingRight: effective.includes('right') ? 'env(safe-area-inset-right, 0px)' : 0,
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
