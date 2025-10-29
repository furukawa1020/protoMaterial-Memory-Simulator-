'use client';

import React, { useState } from 'react';
import { MaterialType, StimulusType } from '@/lib/types';

interface ControlPanelProps {
  onSimulate: (params: {
    material: MaterialType;
    stimulus: StimulusType;
    duration: number;
    intensity: number;
    frequency: number;
  }) => void;
  isLoading: boolean;
}

const materials: { value: MaterialType; label: string; color: string; emoji: string }[] = [
  { value: 'wood', label: '木材', color: 'bg-wood', emoji: '🪵' },
  { value: 'metal', label: '金属', color: 'bg-metal', emoji: '⚙️' },
  { value: 'cloth', label: '布', color: 'bg-cloth', emoji: '🧵' },
  { value: 'soil', label: '土', color: 'bg-soil', emoji: '🌱' },
  { value: 'water', label: '水', color: 'bg-water', emoji: '💧' },
];

const stimuli: { value: StimulusType; label: string; icon: string }[] = [
  { value: 'heat', label: '熱', icon: '🔥' },
  { value: 'pressure', label: '圧力', icon: '👋' },
  { value: 'sound', label: '音', icon: '🔊' },
  { value: 'light', label: '光', icon: '💡' },
  { value: 'pulse', label: 'パルス', icon: '⚡' },
  { value: 'sine', label: '正弦波', icon: '〰️' },
  { value: 'noise', label: 'ノイズ', icon: '📡' },
];

export default function ControlPanel({ onSimulate, isLoading }: ControlPanelProps) {
  const [material, setMaterial] = useState<MaterialType>('wood');
  const [stimulus, setStimulus] = useState<StimulusType>('heat');
  const [duration, setDuration] = useState(10);
  const [intensity, setIntensity] = useState(1.0);
  const [frequency, setFrequency] = useState(1.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate({ material, stimulus, duration, intensity, frequency });
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        🎛️ シミュレーション設定
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 素材選択 */}
        <div>
          <label className="block text-white font-semibold mb-3">
            素材を選択
          </label>
          <div className="grid grid-cols-5 gap-2">
            {materials.map((mat) => (
              <button
                key={mat.value}
                type="button"
                onClick={() => setMaterial(mat.value)}
                className={`p-3 rounded-lg transition-all ${
                  material === mat.value
                    ? 'ring-4 ring-white scale-105'
                    : 'opacity-70 hover:opacity-100'
                } ${mat.color}`}
              >
                <div className="text-2xl">{mat.emoji}</div>
                <div className="text-xs text-white mt-1">{mat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 刺激選択 */}
        <div>
          <label className="block text-white font-semibold mb-3">
            刺激タイプを選択
          </label>
          <div className="grid grid-cols-4 gap-2">
            {stimuli.map((stim) => (
              <button
                key={stim.value}
                type="button"
                onClick={() => setStimulus(stim.value)}
                className={`p-3 rounded-lg transition-all ${
                  stimulus === stim.value
                    ? 'bg-indigo-600 ring-4 ring-white scale-105'
                    : 'bg-gray-600 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-2xl">{stim.icon}</div>
                <div className="text-xs text-white mt-1">{stim.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* パラメータ調整 */}
        <div className="space-y-4">
          {/* 持続時間 */}
          <div>
            <label className="block text-white font-semibold mb-2">
              持続時間: {duration.toFixed(1)}秒
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="slider-custom"
            />
          </div>

          {/* 強度 */}
          <div>
            <label className="block text-white font-semibold mb-2">
              強度: {intensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="slider-custom"
            />
          </div>

          {/* 周波数 */}
          {(stimulus === 'sine' || stimulus === 'sound') && (
            <div>
              <label className="block text-white font-semibold mb-2">
                周波数: {frequency.toFixed(1)} Hz
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="slider-custom"
              />
            </div>
          )}
        </div>

        {/* 実行ボタン */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95'
          } text-white shadow-lg`}
        >
          {isLoading ? '⏳ シミュレーション実行中...' : '🚀 シミュレーション開始'}
        </button>
      </form>
    </div>
  );
}
