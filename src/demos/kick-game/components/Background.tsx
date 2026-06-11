import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BG_FLOOR, BG_SKY, INK } from '../theme';

const { width: SW } = Dimensions.get('window');

type Props = {
  ground?: boolean;
};

export default function Background({ ground = true }: Props) {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.sky} />
      {ground ? (
        <>
          <View style={styles.floor} />
          {/* sketchy comic horizon line between the sky and floor */}
          <View style={styles.horizonWrap}>
            <Svg width={SW} height={14} viewBox={`0 0 ${SW} 14`}>
              {/* slightly wobbly horizon — hand-drawn feel */}
              <Path
                d={`M 0 6 Q ${SW * 0.16} 4 ${SW * 0.32} 7 Q ${SW * 0.48} 9 ${SW * 0.62} 5 Q ${SW * 0.78} 3 ${SW * 0.9} 8 Q ${SW * 0.97} 9 ${SW} 6`}
                fill="none"
                stroke={INK}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </>
      ) : null}
      <View style={[styles.scuff, { top: '14%', left: '8%', transform: [{ rotate: '-18deg' }] }]} />
      <View style={[styles.scuff, { top: '22%', right: '10%', width: 90, transform: [{ rotate: '12deg' }] }]} />
      <View style={[styles.scuff, { top: '34%', left: '22%', width: 60, transform: [{ rotate: '-32deg' }] }]} />
      <View style={[styles.scuff, { top: '8%', right: '28%', width: 50, transform: [{ rotate: '24deg' }] }]} />
    </View>
  );
}

// Floor band is the bottom 40% of the screen — horizon line therefore sits
// at the 60% mark from the top.
const FLOOR_PCT = 0.4;
export const HORIZON_PCT = 1 - FLOOR_PCT; // 0.6

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
  sky: { flex: 1, backgroundColor: BG_SKY },
  floor: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: `${FLOOR_PCT * 100}%`,
    backgroundColor: BG_FLOOR,
  },
  horizonWrap: {
    position: 'absolute',
    left: 0, right: 0,
    top: `${HORIZON_PCT * 100}%`,
    marginTop: -7, // center the 14-tall svg on the horizon
  },
  scuff: {
    position: 'absolute',
    width: 70,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
  },
});
