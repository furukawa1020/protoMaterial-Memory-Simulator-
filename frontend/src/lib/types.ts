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
  causality?: {
    max_correlation: number;
    optimal_lag: number;
    p_value: number;
    is_significant: boolean;
    cross_correlation: number[];
  };
  spectral?: {
    frequencies: number[];
    psd: number[];
    dominant_frequency: number;
    total_power: number;
    low_freq_power: number;
    mid_freq_power: number;
    high_freq_power: number;
    low_freq_ratio: number;
  };
  information_theory?: {
    entropy_input: number;
    entropy_output: number;
    joint_entropy: number;
    mutual_information: number;
    conditional_entropy: number;
    normalized_mutual_information: number;
    transfer_entropy: number;
    information_efficiency: number;
  };
  stationarity?: {
    is_stationary: boolean;
    mean_trend: number;
    variance_trend: number;
    kruskal_p_value: number;
    mean_stability: number;
  };
  lyapunov_exponent?: number;
  system_stability?: string;
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
