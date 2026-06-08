import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Vibration } from 'react-native';
import { KU } from '../theme';
import { SortBox, SortQuestion, SortTile } from '../data/questions';

type Placement = SortBox | null;

type Props = {
  question: SortQuestion;
  onWrongDrop?: () => void;
  onCorrectDrop?: () => void;
  onAllPlaced: () => void;
};

export default function SortBoard({ question, onWrongDrop, onCorrectDrop, onAllPlaced }: Props) {
  const [placements, setPlacements] = useState<Record<string, Placement>>(() =>
    Object.fromEntries(question.tiles.map((t) => [t.id, null]))
  );
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [wrongTile, setWrongTile] = useState<string | null>(null);

  useEffect(() => {
    const allPlaced = question.tiles.every((t) => placements[t.id] !== null);
    if (allPlaced) {
      const id = setTimeout(() => onAllPlaced(), 500);
      return () => clearTimeout(id);
    }
  }, [placements]);

  const handleTilePress = (tileId: string) => {
    if (placements[tileId] !== null) return;
    setSelectedTile(tileId === selectedTile ? null : tileId);
  };

  const handleBoxPress = (box: SortBox) => {
    if (!selectedTile) return;
    const tile = question.tiles.find((t) => t.id === selectedTile);
    if (!tile) return;

    if (box === tile.correct) {
      setPlacements((prev) => ({ ...prev, [tile.id]: box }));
      setSelectedTile(null);
      onCorrectDrop?.();
    } else {
      try {
        Vibration.vibrate(40);
      } catch (e) {}
      setWrongTile(tile.id);
      setTimeout(() => setWrongTile(null), 400);
      onWrongDrop?.();
    }
  };

  const tilesByBox = (box: SortBox) =>
    question.tiles.filter((t) => placements[t.id] === box);

  const trayTiles = question.tiles.filter((t) => placements[t.id] === null);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.hint ? <Text style={styles.hint}>{question.hint}</Text> : null}
      </View>

      <View style={styles.boxRow}>
        <Pressable
          onPress={() => handleBoxPress('left')}
          style={({ pressed }) => [
            styles.box,
            {
              borderColor: question.leftColor + '66',
              backgroundColor: question.leftColor + '14',
            },
            pressed && selectedTile && { borderColor: question.leftColor },
          ]}
        >
          <Text style={[styles.boxLabel, { color: question.leftColor }]}>
            {question.leftLabel}
          </Text>
          <View style={styles.boxTiles}>
            {tilesByBox('left').map((t) => (
              <View key={t.id} style={[styles.placedTile, { borderColor: question.leftColor }]}>
                <Text style={styles.tileText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </Pressable>

        <Pressable
          onPress={() => handleBoxPress('right')}
          style={({ pressed }) => [
            styles.box,
            {
              borderColor: question.rightColor + '66',
              backgroundColor: question.rightColor + '14',
            },
            pressed && selectedTile && { borderColor: question.rightColor },
          ]}
        >
          <Text style={[styles.boxLabel, { color: question.rightColor }]}>
            {question.rightLabel}
          </Text>
          <View style={styles.boxTiles}>
            {tilesByBox('right').map((t) => (
              <View key={t.id} style={[styles.placedTile, { borderColor: question.rightColor }]}>
                <Text style={styles.tileText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </View>

      <View style={styles.tray}>
        {trayTiles.map((tile) => {
          const isSelected = selectedTile === tile.id;
          const isWrong = wrongTile === tile.id;
          return (
            <Pressable
              key={tile.id}
              onPress={() => handleTilePress(tile.id)}
              style={({ pressed }) => [
                styles.tile,
                isSelected && styles.tileSelected,
                isWrong && styles.tileWrong,
                pressed && styles.tilePressed,
              ]}
            >
              <Text style={styles.tileText}>{tile.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedTile && (
        <View style={styles.hintBar}>
          <Text style={styles.hintBarText}>tap a box ↑</Text>
        </View>
      )}
    </View>
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
    borderRadius: 24,
    borderWidth: 2,
    paddingTop: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  boxLabel: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  boxTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tray: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingTop: 16,
  },
  tile: {
    width: 78,
    height: 78,
    borderRadius: 18,
    backgroundColor: KU.bgElevated,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: KU.accentGreen,
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  tileWrong: {
    borderColor: '#FB2C36',
    borderWidth: 3,
  },
  tilePressed: {
    opacity: 0.8,
  },
  placedTile: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: KU.bgElevated,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    color: KU.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  hintBar: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  hintBarText: {
    color: KU.accentGreen,
    fontSize: 14,
    fontWeight: '700',
  },
});
