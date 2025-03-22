import { IMovement, Movement } from './Movement.js';
import { ColumnName } from '../enums/column-name-enum.js';
import { RotationDirection, TranslationDirection } from '../enums/movement-enums.js';

type RotationType = 0 | 180 | -180 | 360 | -360

class MovementFactory {
  static createFromExcelData(data: Map<string, string | number>): Movement {
    const movementData: IMovement = {
      name: data.get(ColumnName.NAME),
      translationDirection: this,
      rotationDirection: this.parseRotationDirection(data.get(ColumnName.TRANSLATION_DIRECTION)),
    };


  }

  private static parseTranslationDirection(value: 0 | 180) {
    return value == 0 ? TranslationDirection.FORWARD : TranslationDirection.BACKWARD;
  }

  private static translationDirection(value: RotationType) {
  }

  private static parseRotationDirection(value: RotationType) {
    let direction: RotationDirection;
    if (value > 0) {
      direction = RotationDirection.COUNTERCLOCKWISE;
    } else if (value < 0) {
      direction = RotationDirection.CLOCKWISE;
    } else {
      direction = RotationDirection.NONE;
    }
    return direction;
  }
}
