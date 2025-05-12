enum Edge {
  INNER = 0,
  OUTER = 1,
  TWO_EDGES = 2,
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
  NONE = 0,
  FORWARD = 1,
  BACKWARD = 2,
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
