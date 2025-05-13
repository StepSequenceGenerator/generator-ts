enum Edge {
  INNER = 'inner',
  OUTER = 'outer',
  TWO_EDGES = 'twoEdges',
}

enum Leg {
  LEFT = 'left',
  RIGHT = 'right',
  BOTH = 'both',
}

enum RotationDegree {
  DEGREES_0 = 0,
  DEGREE_180 = 180,
  DEGREE_360 = 360,
  DEGREE_540 = 540,
  DEGREE_720 = 720,
  DEGREE_900 = 900,
  DEGREE_1080 = 1080,
}

enum RotationDirection {
  NONE = 0,
  COUNTERCLOCKWISE = 1,
  CLOCKWISE = 2,
}

enum RotationDirectionString {
  NONE = 'none',
  COUNTERCLOCKWISE = 'counterclockwise',
  CLOCKWISE = 'clockwise',
}

enum TransitionDirection {
  NONE = 'none',
  FORWARD = 'forward',
  BACKWARD = 'backward',
}

enum MovementCharacter {
  STEP = 'step',
  TURN = 'turn',
  SEQUENCE = 'sequence',
  HOP = 'hop',
  GLIDE = 'glide',
  UNKNOWN = 'unknown',
}

enum SpecialCharacter {
  DIFFICULT = 'difficult',
}

enum ExtendedMovementCharacter {
  STEP = 'step',
  TURN = 'turn',
  SEQUENCE = 'sequence',
  HOP = 'hop',
  GLIDE = 'glide',
  UNKNOWN = 'unknown',
  DIFFICULT = 'difficult',
}

export {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  RotationDirectionString,
  TransitionDirection,
  MovementCharacter,
  ExtendedMovementCharacter,
};
