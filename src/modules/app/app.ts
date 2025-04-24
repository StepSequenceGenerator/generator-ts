import { StepSequenceGenerator } from '../sequence-generator/StepSequenceGenerator.js';
import { AbstractExcelFormatter } from '../source-formatter/AbstractExcelFormatter.js';
import { Movement } from '../movement/Movement.js';
import { Configuration } from '../config/Configuration.js';
import { MovementLibrary } from '../movement/MovementLibrary.js';
import { StepCounter } from '../sequence-generator/StepCounter.js';
import { RouletteGenerator } from '../roulette/RouletteGenerator.js';
import { StepContext } from '../sequence-generator/StepContext.js';
import { MovementWeightCalculator } from '../roulette/MovementWeightCalculator.js';
import { DifficultLevelAmountStep } from '../../enums/difficult-level-amount-step-enum.js';

type AppConstructorParamsType<T extends Record<string, string>> = {
  config: Configuration;
  sourceFormatter: AbstractExcelFormatter<T, Movement[]>;
};

export class App<T extends Record<string, string>> {
  private sequenceGenerator: StepSequenceGenerator | null = null;
  private sourceFormatter: AbstractExcelFormatter<T, Movement[]>;
  private config: Configuration;

  constructor({ sourceFormatter, config }: AppConstructorParamsType<T>) {
    this.sourceFormatter = sourceFormatter;
    this.config = config;
  }

  public generateSequence(
    stepAmountBySequenceLevel: DifficultLevelAmountStep
  ): Movement[] {
    if (this.sequenceGenerator) {
      return this.sequenceGenerator.generate(stepAmountBySequenceLevel);
    } else {
      throw new Error('Необходимо инициализировать приложение');
    }
  }

  public init() {
    const data = this.loadExcelSource(
      this.config.excelPath,
      this.config.excelName
    );
    this.sequenceGenerator = this.createSequenceGenerator(data);
  }

  private createSequenceGenerator(data: Movement[]): StepSequenceGenerator {
    const movementLibrary = new MovementLibrary(data);
    const stepContext = new StepContext();
    const stepCounter = new StepCounter();
    const weightCalc = new MovementWeightCalculator();
    const rouletteGenerator = new RouletteGenerator(weightCalc);
    const generator = new StepSequenceGenerator(
      movementLibrary,
      stepContext,
      stepCounter,
      rouletteGenerator
    );
    return generator;
  }

  private loadExcelSource(dirPath: string, srcFileName: string): Movement[] {
    return this.sourceFormatter.loadSource(dirPath, srcFileName);
  }
}
