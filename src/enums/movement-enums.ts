enum Edge {
  INNER = 0,
  OUTER = 1,
}

enum Leg {
  LEFT = 0,
  RIGHT = 1,
}

enum RotationDegrees {
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

enum TranslationDirection {
  FORWARD = 0,
  BACKWARD = 1,
}

export { Edge, Leg, RotationDegrees, RotationDirection, TranslationDirection };
