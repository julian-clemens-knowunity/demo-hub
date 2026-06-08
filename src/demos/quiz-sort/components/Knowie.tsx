import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

export type KnowieFace =
  | 'standby'
  | 'approving'
  | 'excited'
  | 'laughing'
  | 'giggling'
  | 'amazed'
  | 'angry'
  | 'dazed'
  | 'overIt'
  | 'confused'
  | 'questioning';

const FACE_IMAGES: Record<KnowieFace, ImageSourcePropType> = {
  standby: require('../assets/standby.png'),
  approving: require('../assets/approving.png'),
  excited: require('../assets/excited.png'),
  laughing: require('../assets/laughing.png'),
  giggling: require('../assets/giggling.png'),
  amazed: require('../assets/amazed.png'),
  angry: require('../assets/angry.png'),
  dazed: require('../assets/dazed.png'),
  overIt: require('../assets/overIt.png'),
  confused: require('../assets/confused.png'),
  questioning: require('../assets/questioning.png'),
};

const TINT: Record<KnowieFace, string> = {
  standby: 'rgba(255,255,255,0.04)',
  approving: 'rgba(0,201,80,0.16)',
  excited: 'rgba(255,180,40,0.20)',
  laughing: 'rgba(255,210,60,0.20)',
  giggling: 'rgba(255,160,80,0.16)',
  amazed: 'rgba(232,77,162,0.20)',
  angry: 'rgba(251,44,54,0.22)',
  dazed: 'rgba(120,120,200,0.18)',
  overIt: 'rgba(255,255,255,0.06)',
  confused: 'rgba(142,81,255,0.18)',
  questioning: 'rgba(43,127,255,0.18)',
};

type Props = {
  face: KnowieFace;
  size?: number;
};

export default function Knowie({ face, size = 180 }: Props) {
  const faceSize = size * 0.85;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.tint,
          {
            backgroundColor: TINT[face],
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      <View style={styles.faceLayer}>
        <Image
          source={FACE_IMAGES[face]}
          style={{ width: faceSize, height: faceSize }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tint: {
    position: 'absolute',
  },
  faceLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
