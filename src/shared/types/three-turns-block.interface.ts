interface IThreeTurnsBlock {
  blockNumber: number;
  orderNumber: number;
}

interface IThreeTurnsBlockInfo {
  threeTurnsBlockInfo: IThreeTurnsBlock | null;
}

export type { IThreeTurnsBlock, IThreeTurnsBlockInfo };
