// Representa uma leitura de consumo de energia.
export interface EnergyReading {
    deviceId: string;
    timestamp: string;
    consumptionKwh: number;
  }
  