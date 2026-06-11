export type SceneHandle = {
  onFlick: (vx: number, vy: number) => void;
};

export type SceneProps = {
  onComplete: () => void;
};
