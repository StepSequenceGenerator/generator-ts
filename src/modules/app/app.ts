import { AbstractExcelFormatter } from '../source-formatter/AbstractExcelFormatter.js';
import { Movement } from '../movement/Movement.js';
import { Configuration } from '../config/Configuration.js';
import { DifficultLevelAmountStep } from '../../shared/enums/difficult-level-amount-step-enum.js';
import { IMovementExtended } from '../../shared/types/extended-movement/movement-extended.interface';
import { SequenceGeneratorFactory } from '../sequence-generator/SequenceGeneratorFactory';
import { DefaultStepSequenceGenerator } from '../sequence-generator/DefaultStepSequenceGenerator';
import { DistanceFactorType } from '../../shared/types/distance-factor.type';

type AppConstructorParamsType<T extends Record<string, string>> = {
  config: Configuration;
  sourceFormatter: AbstractExcelFormatter<T, Movement[]>;
};

export class App<T extends Record<string, string>> {
  private sequenceGenerator: DefaultStepSequenceGenerator | null = null;
  private sourceFormatter: AbstractExcelFormatter<T, Movement[]>;
  private config: Configuration;

  constructor({ sourceFormatter, config }: AppConstructorParamsType<T>) {
    this.sourceFormatter = sourceFormatter;
    this.config = config;
  }

  public generateSequence(
    stepAmountBySequenceLevel: DifficultLevelAmountStep,
    distanceFactor: DistanceFactorType,
  ): IMovementExtended[] {
    if (this.sequenceGenerator) {
      return this.sequenceGenerator.generate(stepAmountBySequenceLevel, distanceFactor);
    } else {
      throw new Error('Необходимо инициализировать приложение');
    }
  }

  public init() {
    const data = this.loadExcelSource(this.config.excelPath, this.config.excelName);
    this.sequenceGenerator = this.createSequenceGenerator(data);
  }

  private createSequenceGenerator(data: Movement[]): DefaultStepSequenceGenerator {
    return SequenceGeneratorFactory.createDefaultGenerator(data);
  }

  private loadExcelSource(dirPath: string, srcFileName: string): Movement[] {
    return this.sourceFormatter.loadSource(dirPath, srcFileName);
  }
}
