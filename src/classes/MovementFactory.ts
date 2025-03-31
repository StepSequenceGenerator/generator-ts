import lodash from 'lodash';
import { MovementParserError } from '../errors/custom-errors.js';
import { IMovement, Movement } from './Movement.js';
import { ColumnName } from '../enums/column-name-enum.js';
import { Edge, Leg, RotationDegrees, RotationDirection, TranslationDirection } from '../enums/movement-enums.js';

const { isEqual } = lodash;

type RotationDegreeType = 0 | 180 | -180 | 360 | -360;
const RIGHT_LEG = 'правая';
const LEFT_LEG = 'левая';
const INNER_EDGE = 'наружное';
const OUTER_EDGE = 'внутреннее';
const TWO_EDGES = 'два ребра';

class MovementFactory {
  static createFromExcelData<T extends Record<string, string>>(data: Map<string, string | number>, columnName: T): Movement {
    const movementData: IMovement = {
      name: this.parseName(data.get(ColumnName.NAME)),
      translationDirection: this.parseTranslationDirection(data.get(ColumnName.TRANSLATION_DIRECTION)),
      rotationDirection: this.parseRotationDirection(data.get(ColumnName.ROTATION_DIRECTION)),
      rotationDegree: this.parseRotationDegree(data.get(ColumnName.ROTATION_DIRECTION)),
      startLeg: this.parseStartLeg(data.get(ColumnName.START_LEG)),
      isChangeLeg: this.parseIsChangeLeg(data.get(ColumnName.START_LEG), data.get(ColumnName.END_LEG)),
      startEdge: this.parseStartEdge(data.get(ColumnName.START_EDGE)),
      isChangeEdge: this.parseIsChangeEdge(data.get(ColumnName.START_EDGE), data.get(ColumnName.END_EDGE)),
      isSpeedIncrease: this.parseIsSpeedIncrease(data.get(ColumnName.IS_SPEED_INCREASE)),
    };

    return new Movement(movementData);
  }

  private static parseName(value: unknown): string {
    const formattedValue = String(value);
    if (formattedValue) {
      return String(formattedValue);
    } else {
      return 'Неизвестный шаг';
    }
  }


  private static parseStartEdge(value: unknown): Edge {
    const formatedValue = String(value);

    this.validateEdge(formatedValue);

    if (formatedValue === INNER_EDGE) {
      return Edge.INNER;
    } else if (formatedValue === OUTER_EDGE) {
      return Edge.OUTER;
    } else {
      return Edge.TWO_EDGES;
    }
  }

  private static parseIsChangeEdge(startEdge: unknown, endEdge: unknown): boolean {
    const formatedStartEdge = String(startEdge);
    this.validateEdge(formatedStartEdge);
    const formatedEndEdge = String(endEdge);
    this.validateEdge(formatedEndEdge);

    return formatedStartEdge === formatedEndEdge;
  }

  private static validateEdge(value: string): void {
    if (value !== INNER_EDGE && value !== OUTER_EDGE && value !== TWO_EDGES) throw new MovementParserError('wrong value for edge', 'INVALID_EDGE');
  }


  private static parseIsSpeedIncrease(value: unknown): boolean {
    const formatedValue = Number(value);

    if (Number.isNaN(formatedValue)) throw new MovementParserError('wrong value for speedIncrease', 'INVALID_SPEED_INCREASE');

    return Boolean(formatedValue);

  }


  private static parseStartLeg(value: unknown): Leg[] {
    const valueList = this.getLegList(value);
    this.validateLegList(valueList);

    if (valueList.includes(LEFT_LEG) && valueList.includes(RIGHT_LEG)) {
      return [Leg.LEFT, Leg.RIGHT];
    } else if (valueList.includes(LEFT_LEG)) {
      return [Leg.LEFT];
    } else {
      return [Leg.RIGHT];
    }
  }

  private static parseIsChangeLeg(startLeg: unknown, endLeg: unknown): boolean {
    const startLegList = this.getLegList(startLeg);
    const endLegList = this.getLegList(endLeg);

    this.validateLegList(startLegList);
    this.validateLegList(endLegList);

    return isEqual(startLegList, endLegList);

  }

  private static validateLegList(value: string[]): void {
    if (!value.includes(LEFT_LEG) && !value.includes(RIGHT_LEG)) throw new MovementParserError('wrong Leg', 'INVALID_LEG');
  }

  private static getLegList(value: unknown) {
    return String(value).split(',').sort((a, b) => a.localeCompare(b));
  }


  private static parseTranslationDirection(value: unknown): TranslationDirection {
    const formattedValue = Number(value);
    if (Number.isNaN(formattedValue)) {
      return TranslationDirection.NONE;
    } else if (formattedValue === 0) {
      return TranslationDirection.FORWARD;
    } else {
      return TranslationDirection.BACKWARD;
    }

  }

  private static parseRotationDirection(value: unknown): RotationDirection {
    let direction: RotationDirection;
    const formatedValue = Number(value);

    if (Number.isNaN(formatedValue)) throw new MovementParserError('wrong value for rotationDirection', 'INVALID_ROTATION_DIRECTION');

    if (formatedValue > 0) {
      direction = RotationDirection.COUNTERCLOCKWISE;
    } else if (formatedValue < 0) {
      direction = RotationDirection.CLOCKWISE;
    } else {
      direction = RotationDirection.NONE;
    }
    return direction;
  }


  private static parseRotationDegree(value: unknown): RotationDegrees {
    const formatedValue = Number(value);
    if (Number.isNaN(formatedValue)) throw new MovementParserError('wrong value for rotationDirection', 'INVALID_ROTATION_DIRECTION');

    const validDegrees = Object.values(RotationDegrees);
    if (!validDegrees.includes(formatedValue)) {
      return RotationDegrees.DEGREES_0;
    } else {
      return formatedValue as RotationDegrees;
    }
  }
}

export { MovementFactory };
