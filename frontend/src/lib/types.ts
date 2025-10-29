/**
 * 型定義
 */

export type MaterialType = 'wood' | 'metal' | 'cloth' | 'soil' | 'water';

export type StimulusType = 'heat' | 'pressure' | 'sound' | 'light' | 'pulse' | 'sine' | 'noise';

export interface SimulationRequest {
  material_type: MaterialType;
  stimulus_type: StimulusType;
  duration: number;
  intensity: number;
  frequency: number;
  dt: number;
}

export interface AnalysisResult {
  autocorrelation: number[];
  memory_tau: number;
  entropy: number;
  peak_response: number;
  peak_time: number;
  decay_rate: number;
  mutual_information: number;
}

export interface SimulationResponse {
  time: number[];
  stimulus: number[];
  response: number[];
  internal_states: number[][];
  analysis: AnalysisResult;
}

export interface MaterialInfo {
  name: string;
  tau_list: number[];
  k_list: number[];
  w_list: number[];
}
