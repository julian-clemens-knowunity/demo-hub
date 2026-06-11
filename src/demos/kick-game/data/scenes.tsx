import React from 'react';
import SodaCan from '../components/SodaCan';
import PunchingBag from '../components/PunchingBag';
import PaperPlane from '../components/PaperPlane';
import { Watermelon, WatermelonSlice } from '../components/Watermelon';
import Lightbulb from '../components/Lightbulb';
import { GlassShards, MelonChunk } from '../components/Shards';
import type { SoundName } from '../sounds';
import { View } from 'react-native';
// SoccerBall + SoccerGoal + Keeper are used by the dedicated SoccerScene, not here.

export type KickKind = 'launch' | 'swing' | 'smash' | 'score';

export type KickSpec = {
  id: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  ground: boolean;
  kick: KickKind;
  sound: SoundName;
  scoreEnd?: { dx: number; dy: number };
  render: (kicked: boolean) => React.ReactNode;
  renderShards?: () => React.ReactNode;
  renderDecorations?: () => React.ReactNode;
};

export const SCENES: KickSpec[] = [
  {
    id: 'can',
    width: 140,
    height: 220,
    startX: 0.5,
    startY: 0.62,
    ground: true,
    kick: 'launch',
    sound: 'kick',
    render: () => <SodaCan size={140} />,
  },
  {
    id: 'bag',
    width: 200,
    height: 440,
    startX: 0.5,
    startY: 0.5,
    ground: false,
    kick: 'swing',
    sound: 'punch',
    render: (kicked) => <PunchingBag size={200} hit={kicked} />,
  },
  {
    id: 'watermelon',
    width: 180,
    height: 180,
    startX: 0.5,
    startY: 0.5,
    ground: true,
    kick: 'smash',
    sound: 'crack',
    render: () => <Watermelon size={180} />,
    renderShards: () => (
      <>
        <View style={{ position: 'absolute', left: '20%', top: '54%' }}>
          <WatermelonSlice size={120} />
        </View>
        <View style={{ position: 'absolute', left: '50%', top: '60%' }}>
          <WatermelonSlice size={100} flip />
        </View>
        <View style={{ position: 'absolute', left: '40%', top: '40%' }}>
          <MelonChunk size={70} rot={-26} />
        </View>
        <View style={{ position: 'absolute', left: '60%', top: '46%' }}>
          <MelonChunk size={60} rot={32} />
        </View>
      </>
    ),
  },
  {
    id: 'bulb',
    width: 180,
    height: 234,
    startX: 0.5,
    startY: 0.46,
    ground: false,
    kick: 'smash',
    sound: 'shatter',
    render: () => <Lightbulb size={180} />,
    renderShards: () => (
      <View style={{ position: 'absolute', left: '50%', top: '46%', marginLeft: -110, marginTop: -110 }}>
        <GlassShards size={220} />
      </View>
    ),
  },
  {
    id: 'plane',
    width: 180,
    height: 130,
    startX: 0.5,
    startY: 0.5,
    ground: false,
    kick: 'launch',
    sound: 'whoosh',
    render: () => <PaperPlane size={180} />,
  },
];
