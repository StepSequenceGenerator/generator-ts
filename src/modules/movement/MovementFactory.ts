import lodash from 'lodash';
import { MovementParserError } from '../../errors/custom-errors.js';
import { IMovement, Movement } from './Movement.js';
import {
  Edge,
  Leg,
  MovementCharacter,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../../shared/enums/movement-enums.js';
import { MapValueTypeBase } from '../../shared/types/map-value-type-base.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name-enum.js';

const { isEqual } = lodash;

const RIGHT_LEG = 'правая';
const LEFT_LEG = 'левая';
const INNER_EDGE = 'внутреннее';
const OUTER_EDGE = 'наружное';
const TWO_EDGES = 'два ребра';

export type ParseTypeArgsType = {
  isSequence: unknown;
  startLeg: Leg;
  endLeg: Leg;
  rotationDegree: RotationDegree;
  isDifficult: boolean;
};

class MovementFactory {
  static createFromExcelData<T extends Record<string, string>>(
    data: Map<string, MapValueTypeBase>,
    columnName: T,
  ): Movement {
    const movementData: IMovement = {
      id: this.parseId(data.get(columnName.ID)),
      name: this.parseName(data.get(columnName.NAME)),

      transitionDirection: this.parseTransitionDirection(
        data.get(columnName.TRANSLATION_DIRECTION),
      ),

      rotationDirection: this.parseRotationDirection(data.get(columnName.ROTATION_DIRECTION)),

      rotationDegree: this.parseRotationDegree(data.get(columnName.ROTATION_DIRECTION)),

      startLeg: this.parseLeg(data.get(columnName.START_LEG)),

      endLeg: this.parseLeg(data.get(columnName.END_LEG)),

      isChangeLeg: this.parseIsChangeLeg(
        data.get(columnName.START_LEG),
        data.get(columnName.END_LEG),
      ),
      startEdge: this.parseEdge(data.get(columnName.START_EDGE)),

      endEdge: this.parseEdge(data.get(columnName.END_EDGE)),

      isChangeEdge: this.parseIsChangeEdge(
        data.get(columnName.START_EDGE),
        data.get(columnName.END_EDGE),
      ),

      isSpeedIncrease: this.parseIsSpeedIncrease(data.get(columnName.IS_SPEED_INCREASE)),

      isDifficult: this.parseIsDifficult(data.get(columnName.IS_DIFFICULT)),

      type: this.parseType(data.get(columnName.TYPE)),

      description: this.parseDescription(data.get(columnName.DESCRIPTION)),

      absoluteName: this.parseAbsoluteName(data.get(columnName.ABSOLUTE_NAME)),

      distance: this.parseDistance(data.get(columnName.DISTANCE)),
    };

    return new Movement(movementData);
  }

  // todo написать тесты
  private static parseId(value: unknown): string {
    return String(value).trim();
  }

  private static parseName(value: unknown): string {
    const formattedValue = this.formatToString(value);
    if (formattedValue) {
      return String(formattedValue);
    } else {
      return 'Неизвестный шаг';
    }
  }

  private static parseEdge(value: unknown): Edge {
    const formatedValue = this.formatToString(value);

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
    const formatedStartEdge = this.formatToString(startEdge);
    this.validateEdge(formatedStartEdge);
    const formatedEndEdge = this.formatToString(endEdge);
    this.validateEdge(formatedEndEdge);

    return formatedStartEdge !== formatedEndEdge;
  }

  private static validateEdge(value: string): boolean {
    if (value !== INNER_EDGE && value !== OUTER_EDGE && value !== TWO_EDGES) {
      throw new MovementParserError('wrong value for edge', 'INVALID_EDGE');
    }
    return true;
  }

  private static parseIsSpeedIncrease(value: unknown): boolean {
    const formatedValue = this.formatToNumber(value);

    if (formatedValue === null)
      throw new MovementParserError('wrong value for speedIncrease', 'INVALID_SPEED_INCREASE');

    return Boolean(formatedValue);
  }

  private static parseLeg(value: unknown): Leg {
    const valueList = this.getLegList(value);
    this.validateLegList(valueList);
    if (valueList.includes(LEFT_LEG) && valueList.includes(RIGHT_LEG)) {
      return Leg.BOTH;
    } else if (valueList.includes(LEFT_LEG)) {
      return Leg.LEFT;
    } else {
      return Leg.RIGHT;
    }
  }

  private static parseIsChangeLeg(startLeg: unknown, endLeg: unknown): boolean {
    const startLegList = this.getLegList(startLeg);
    const endLegList = this.getLegList(endLeg);

    this.validateLegList(startLegList);
    this.validateLegList(endLegList);

    return !isEqual(startLegList, endLegList);
  }

  private static validateLegList(value: string[]): boolean {
    if (!value.includes(LEFT_LEG) && !value.includes(RIGHT_LEG))
      throw new MovementParserError('wrong Leg', 'INVALID_LEG');
    return true;
  }

  private static getLegList(value: unknown) {
    return String(value)
      .split(',')
      .sort((a, b) => a.localeCompare(b))
      .map((item) => item.trim());
  }

  private static parseTransitionDirection(value: unknown): TransitionDirection {
    const formattedValue = this.formatToNumber(value);
    if (formattedValue === null) {
      return TransitionDirection.NONE;
    } else if (formattedValue === 0) {
      return TransitionDirection.FORWARD;
    } else {
      return TransitionDirection.BACKWARD;
    }
  }

  private static parseRotationDirection(value: unknown): RotationDirection {
    let direction: RotationDirection;
    const formatedValue = this.formatToNumber(value);
    if (formatedValue === null) {
      throw new MovementParserError(
        'from parseRotationDirection: wrong value for rotationDirection',
        'INVALID_ROTATION_DIRECTION',
      );
    }

    if (formatedValue > 0) {
      direction = RotationDirection.COUNTERCLOCKWISE;
    } else if (formatedValue < 0) {
      direction = RotationDirection.CLOCKWISE;
    } else {
      direction = RotationDirection.NONE;
    }
    return direction;
  }

  private static parseRotationDegree(value: unknown): RotationDegree {
    const formatedValue = Math.abs(Number(value));
    if (Number.isNaN(formatedValue))
      throw new MovementParserError(
        'from parseRotationDegree: wrong value for rotationDirection',
        'INVALID_ROTATION_DIRECTION',
      );

    const validDegrees = Object.values(RotationDegree);
    if (!validDegrees.includes(formatedValue)) {
      return RotationDegree.DEGREES_0;
    } else {
      return formatedValue as RotationDegree;
    }
  }

  private static parseIsDifficult(value: unknown): boolean {
    // note чтобы не проверять на Number.isNaN(value)
    return !(value === null || value == 0);
  }

  private static parseType(value: unknown): MovementCharacter {
    return this.straightParseString<typeof MovementCharacter, MovementCharacter>(
      value,
      MovementCharacter,
      MovementCharacter.UNKNOWN,
    );
  }

  private static parseDescription(value: unknown): string {
    return String(value || '');
  }

  private static parseAbsoluteName(value: unknown): TurnAbsoluteName {
    return this.straightParseString<typeof TurnAbsoluteName, TurnAbsoluteName>(
      value,
      TurnAbsoluteName,
      TurnAbsoluteName.UNKNOWN,
    );
  }

  private static parseDistance(value: unknown): number {
    const formattedValue = this.formatToNumber(value);
    return formattedValue === null ? 1 : formattedValue;
  }

  private static straightParseString<E extends Record<string, string>, T extends E[keyof E]>(
    value: unknown,
    enumObj: E,
    defaultValue: T,
  ): T {
    const formattedValue = this.formatToString(value);

    const match = Object.values(enumObj).find((val) => val === formattedValue);

    return (match as unknown as T) ?? defaultValue;
  }

  private static formatToString(value: unknown): string {
    return String(value).trim().toLowerCase();
  }

  private static formatToNumber(value: unknown): number | null {
    return Number.isNaN(Number(value)) ? null : Number(value);
  }
}

export { MovementFactory };
