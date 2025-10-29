/**
 * API通信ユーティリティ
 */
import { SimulationRequest, SimulationResponse, MaterialInfo } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchMaterials(): Promise<Record<string, MaterialInfo>> {
  const response = await fetch(`${API_BASE_URL}/materials`);
  if (!response.ok) {
    throw new Error('Failed to fetch materials');
  }
  return response.json();
}

export async function runSimulation(request: SimulationRequest): Promise<SimulationResponse> {
  const response = await fetch(`${API_BASE_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Simulation failed');
  }
  
  return response.json();
}

export async function compareSimulations(requests: SimulationRequest[]): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requests),
  });
  
  if (!response.ok) {
    throw new Error('Comparison failed');
  }
  
  return response.json();
}
