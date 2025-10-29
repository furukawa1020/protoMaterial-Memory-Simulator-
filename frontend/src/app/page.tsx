'use client';

import React, { useState } from 'react';
import ControlPanel from '@/components/ControlPanel';
import Visualization from '@/components/Visualization';
import AcademicAnalysis from '@/components/AcademicAnalysis';
import ExportPanel from '@/components/ExportPanel';
import { runSimulation } from '@/lib/api';
import { SimulationResponse, MaterialType, StimulusType } from '@/lib/types';
import '../globals.css';

const materialNames: Record<MaterialType, string> = {
  wood: '木材',
  metal: '金属',
  cloth: '布',
  soil: '土',
  water: '水',
};

export default function Home() {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<string>('');
  const [currentMaterialType, setCurrentMaterialType] = useState<MaterialType>('wood');
  const [currentStimulusType, setCurrentStimulusType] = useState<StimulusType>('heat');
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (params: {
    material: MaterialType;
    stimulus: StimulusType;
    duration: number;
    intensity: number;
    frequency: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await runSimulation({
        material_type: params.material,
        stimulus_type: params.stimulus,
        duration: params.duration,
        intensity: params.intensity,
        frequency: params.frequency,
        dt: 0.01,
      });
      
      setResult(response);
      setCurrentMaterial(materialNames[params.material]);
      setCurrentMaterialType(params.material);
      setCurrentStimulusType(params.stimulus);
    } catch (err) {
      setError('シミュレーションに失敗しました。バックエンドが起動しているか確認してください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌿 Material Memory Simulator
          </h1>
          <p className="text-xl text-gray-200">
            自然素材の非線形遅延特性を体験・分析する
          </p>
          <p className="text-sm text-gray-300 mt-2">
            素材が刺激に対して「記憶」し「余韻」を残す様子を情報理論で可視化
          </p>
        </header>

        {/* エラー表示 */}
        {error && (
          <div className="glass-card p-4 mb-6 bg-red-500 bg-opacity-20 border-red-400">
            <p className="text-white">⚠️ {error}</p>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左サイド：コントロールパネル */}
          <div className="lg:col-span-1">
            <ControlPanel onSimulate={handleSimulate} isLoading={isLoading} />
          </div>

          {/* 右サイド:可視化エリア */}
          <div className="lg:col-span-2 space-y-6">
            <Visualization data={result} materialName={currentMaterial} />
            {result && <AcademicAnalysis data={result} materialName={currentMaterial} />}
            {result && (
              <ExportPanel
                data={result}
                materialType={currentMaterialType}
                stimulusType={currentStimulusType}
              />
            )}
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center text-gray-300 text-sm">
          <p>
            💡 このシミュレーションは、素材が持つ「時間的な記憶」を非線形遅延系としてモデル化しています
          </p>
          <p className="mt-2">
            🔬 研究目的：情報理論×自然素材の体験的探究
          </p>
        </footer>
      </div>
    </div>
  );
}
