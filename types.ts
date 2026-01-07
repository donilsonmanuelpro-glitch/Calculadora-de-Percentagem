
export interface CalculationResult {
  value: number;
  formatted: string;
}

export enum CalculationMode {
  PERCENT_OF = 'PERCENT_OF',
  ADD_PERCENT = 'ADD_PERCENT',
  SUBTRACT_PERCENT = 'SUBTRACT_PERCENT',
  WHAT_PERCENT = 'WHAT_PERCENT',
  PERCENT_CHANGE = 'PERCENT_CHANGE'
}

export interface InsightResponse {
  explanation: string;
  realWorldExample: string;
}
