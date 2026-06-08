import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { KU } from '../theme';
import { SortBox, SortQuestion, SortTile } from '../data/questions';

type Rect = { x: number; y: number; w: number; h: number };
type Placement = SortBox | null;
type RectsRef = { left: Rect | null; right: Rect | null };

const TILE_W = 78;
const TILE_H = 78;
const TRAY_GAP = 12;
const SLOT_GAP = 8;
const BOX_HEADER_PAD = 52;

type Props = {
  question: SortQuestion;
  onWrongDrop?: () => void;
  onCorrectDrop?: () => void;
  onAllPlaced: () => void;
};

export default function SortBoard({ question, onWrongDrop, onCorrectDrop, onAllPlaced }: Props) {
  const [boardW, setBoardW] = useState(0);
  const [trayY, setTrayY] = useState(0);
  const [leftRect, setLeftRect] = useState<Rect | null>(null);
  const [rightRect, setRightRect] = useState<Rect | null>(null);
  const [placements, setPlacements] = useState<Record<string, Placement>>(() =>
    Object.fromEntries(question.tiles.map((t) => [t.id, null]))
  );

  // Refs the PanResponder handlers can read live.
  const rectsRef = useRef<RectsRef>({ left: null, right: null });
  rectsRef.current = { left: leftRect, right: rightRect };
  const placementsRef = useRef(placements);
  placementsRef.current = placements;
  const placementOrderRef = useRef<Record<string, number>>({});
  const placementCounterRef = useRef(0);

  const tilePansRef = useRef<Record<string, Animated.ValueXY>>({});
  const tileWiggleRef = useRef<Record<string, Animated.Value>>({});
  question.tiles.forEach((t) => {
    if (!tilePansRef.current[t.id]) tilePansRef.current[t.id] = new Animated.ValueXY({ x: 0, y: 0 });
    if (!tileWiggleRef.current[t.id]) tileWiggleRef.current[t.id] = new Animated.Value(0);
  });

  // Measure boxes/tray relative to the board root after layout.
  const rootRef = useRef<View>(null);
  const leftBoxRef = useRef<View>(null);
  const rightBoxRef = useRef<View>(null);
  const trayRef = useRef<View>(null);

  const measureAll = () => {
    if (!rootRef.current) return;
    const root = rootRef.current as any;
    if (leftBoxRef.current) {
      (leftBoxRef.current as any).measureLayout(
        root,
        (x: number, y: number, w: number, h: number) => setLeftRect({ x, y, w, h }),
        () => {}
      );
    }
    if (rightBoxRef.current) {
      (rightBoxRef.current as any).measureLayout(
        root,
        (x: number, y: number, w: number, h: number) => setRightRect({ x, y, w, h }),
        () => {}
      );
    }
    if (trayRef.current) {
      (trayRef.current as any).measureLayout(
        root,
        (_x: number, y: number) => setTrayY(y),
        () => {}
      );
    }
  };

  // Home (top-left board-local coords) for a given tile.
  function homeFor(tileId: string, p = placementsRef.current): { x: number; y: number } {
    const placement = p[tileId];
    if (!placement) {
      const trayTiles = question.tiles.filter((t) => p[t.id] === null).map((t) => t.id);
      const idx = Math.max(0, trayTiles.indexOf(tileId));
      const n = trayTiles.length || 1;
      const totalW = n * TILE_W + Math.max(0, n - 1) * TRAY_GAP;
      const startX = (boardW - totalW) / 2;
      return { x: startX + idx * (TILE_W + TRAY_GAP), y: trayY + 18 };
    }
    const rect = placement === 'left' ? rectsRef.current.left : rectsRef.current.right;
    if (!rect) return { x: 0, y: 0 };
    const placed = question.tiles
      .filter((t) => p[t.id] === placement)
      .sort((a, b) => (placementOrderRef.current[a.id] ?? 0) - (placementOrderRef.current[b.id] ?? 0))
      .map((t) => t.id);
    const idx = Math.max(0, placed.indexOf(tileId));
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const gridW = 2 * TILE_W + SLOT_GAP;
    const innerLeft = rect.x + (rect.w - gridW) / 2;
    const innerTop = rect.y + BOX_HEADER_PAD;
    return { x: innerLeft + col * (TILE_W + SLOT_GAP), y: innerTop + row * (TILE_H + SLOT_GAP) };
  }

  const ready = boardW > 0 && trayY > 0 && !!leftRect && !!rightRect;
  const firstLayoutRef = useRef(true);

  useEffect(() => {
    if (!ready) return;
    question.tiles.forEach((t) => {
      const pan = tilePansRef.current[t.id];
      const { x, y } = homeFor(t.id);
      if (firstLayoutRef.current) {
        pan.setValue({ x, y });
      } else {
        Animated.spring(pan, {
          toValue: { x, y },
          friction: 7,
          tension: 110,
          useNativeDriver: false,
        }).start();
      }
    });
    firstLayoutRef.current = false;
  }, [ready, placements, boardW, trayY, leftRect, rightRect]);

  useEffect(() => {
    if (!ready) return;
    const allPlaced = question.tiles.every((t) => placements[t.id] !== null);
    if (allPlaced) {
      const id = setTimeout(() => onAllPlaced(), 460);
      return () => clearTimeout(id);
    }
  }, [placements, ready]);

  const runWiggle = (tileId: string) => {
    const w = tileWiggleRef.current[tileId];
    w.setValue(0);
    Animated.sequence([
      Animated.timing(w, { toValue: 1, duration: 60, useNativeDriver: false }),
      Animated.timing(w, { toValue: -1, duration: 80, useNativeDriver: false }),
      Animated.timing(w, { toValue: 1, duration: 80, useNativeDriver: false }),
      Animated.timing(w, { toValue: 0, duration: 80, useNativeDriver: false }),
    ]).start();
  };

  const handleDrop = (tile: SortTile, box: SortBox | null) => {
    if (placementsRef.current[tile.id] !== null) return;

    if (box && box === tile.correct) {
      placementOrderRef.current[tile.id] = ++placementCounterRef.current;
      setPlacements((prev) => ({ ...prev, [tile.id]: box }));
      onCorrectDrop?.();
      return;
    }

    if (box) {
      Vibration.vibrate(40);
      runWiggle(tile.id);
      onWrongDrop?.();
    }
    const home = homeFor(tile.id);
    Animated.spring(tilePansRef.current[tile.id], {
      toValue: home,
      friction: 7,
      tension: 110,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={(e: LayoutChangeEvent) => {
        setBoardW(e.nativeEvent.layout.width);
        measureAll();
      }}
    >
      <View style={styles.header}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.hint ? <Text style={styles.hint}>{question.hint}</Text> : null}
      </View>

      <View style={styles.boxRow}>
        <View
          ref={leftBoxRef}
          onLayout={measureAll}
          style={[
            styles.box,
            { borderColor: question.leftColor + '66', backgroundColor: question.leftColor + '14' },
          ]}
        >
          <Text style={[styles.boxLabel, { color: question.leftColor }]}>{question.leftLabel}</Text>
        </View>
        <View
          ref={rightBoxRef}
          onLayout={measureAll}
          style={[
            styles.box,
            { borderColor: question.rightColor + '66', backgroundColor: question.rightColor + '14' },
          ]}
        >
          <Text style={[styles.boxLabel, { color: question.rightColor }]}>{question.rightLabel}</Text>
        </View>
      </View>

      <View ref={trayRef} onLayout={measureAll} style={styles.tray} />

      {ready &&
        question.tiles.map((tile) => (
          <DraggableTile
            key={tile.id}
            tile={tile}
            pan={tilePansRef.current[tile.id]}
            wiggle={tileWiggleRef.current[tile.id]}
            getRects={() => rectsRef.current}
            isLocked={() => placementsRef.current[tile.id] !== null}
            onDrop={(box) => handleDrop(tile, box)}
          />
        ))}
    </View>
  );
}

type TileProps = {
  tile: SortTile;
  pan: Animated.ValueXY;
  wiggle: Animated.Value;
  getRects: () => RectsRef;
  isLocked: () => boolean;
  onDrop: (box: SortBox | null) => void;
};

function DraggableTile({ tile, pan, wiggle, getRects, isLocked, onDrop }: TileProps) {
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLocked(),
      onMoveShouldSetPanResponder: () => !isLocked(),
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const cx = (pan.x as any)._value + TILE_W / 2;
        const cy = (pan.y as any)._value + TILE_H / 2;
        const rects = getRects();
        const inside = (r: Rect | null) =>
          !!r && cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h;
        if (inside(rects.left)) onDrop('left');
        else if (inside(rects.right)) onDrop('right');
        else onDrop(null);
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        onDrop(null);
      },
    })
  ).current;

  const wiggleRot = wiggle.interpolate({ inputRange: [-1, 1], outputRange: ['-14deg', '14deg'] });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.tile,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: wiggleRot }],
        },
      ]}
    >
      <Text style={styles.tileText}>{tile.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: KU.bg,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  prompt: {
    color: KU.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    color: KU.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  boxRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
    height: 320,
  },
  box: {
    flex: 1,
    borderRadius: KU.r24,
    borderWidth: 2,
    paddingTop: 14,
    alignItems: 'center',
  },
  boxLabel: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  tray: {
    marginTop: 24,
    height: TILE_H + 36,
  },
  tile: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: TILE_W,
    height: TILE_H,
    borderRadius: 18,
    backgroundColor: KU.bgElevated,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  tileText: {
    color: KU.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
});
