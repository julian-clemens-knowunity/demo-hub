import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import standbyImg from '../assets/standby.png';
import approvingImg from '../assets/approving.png';
import excitedImg from '../assets/excited.png';
import laughingImg from '../assets/laughing.png';
import gigglingImg from '../assets/giggling.png';
import amazedImg from '../assets/amazed.png';
import angryImg from '../assets/angry.png';
import dazedImg from '../assets/dazed.png';
import overItImg from '../assets/overIt.png';
import confusedImg from '../assets/confused.png';
import questioningImg from '../assets/questioning.png';

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
  standby: standbyImg,
  approving: approvingImg,
  excited: excitedImg,
  laughing: laughingImg,
  giggling: gigglingImg,
  amazed: amazedImg,
  angry: angryImg,
  dazed: dazedImg,
  overIt: overItImg,
  confused: confusedImg,
  questioning: questioningImg,
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
