/**
 * 音響フィードバックユーティリティ(Tone.js) - 一時的に無効化
 * 素材の特性に応じた音色・周波数マッピング
 */
// import * as Tone from 'tone';
import { MaterialType, SimulationResponse } from './types';

// 素材ごとの音色マッピング
const MATERIAL_SOUNDS: Record<MaterialType, { baseFreq: number; waveform: string }> = {
  wood: { baseFreq: 220, waveform: 'triangle' },      // 木: 温かみのある三角波
  metal: { baseFreq: 440, waveform: 'sine' },         // 金属: クリアな正弦波
  cloth: { baseFreq: 330, waveform: 'sawtooth' },     // 布: 柔らかいノコギリ波
  soil: { baseFreq: 165, waveform: 'square' },        // 土: 重厚な矩形波
  water: { baseFreq: 523.25, waveform: 'sine' },      // 水: 高音の正弦波
};

// let synth: Tone.Synth | null = null;
let isInitialized = false;

/**
 * Tone.jsの初期化(ユーザーインタラクション後に呼ぶ)
 */
export async function initAudio(): Promise<void> {
  if (isInitialized) return;
  
  console.log('[Audio] Tone.js is temporarily disabled');
  // await Tone.start();
  // synth = new Tone.Synth({
  //   oscillator: {
  //     type: 'sine'
  //   },
  //   envelope: {
  //     attack: 0.1,
  //     decay: 0.2,
  //     sustain: 0.3,
  //     release: 1
  //   }
  // }).toDestination();
  
  isInitialized = true;
}

/**
 * シミュレーション結果に基づいた音響再生
 * @param material 素材タイプ
 * @param data シミュレーション結果
 * @param duration 再生時間(秒)
 */
export async function playMaterialSound(
  material: MaterialType,
  data: SimulationResponse,
  duration: number = 2
): Promise<void> {
  if (!isInitialized) {
    await initAudio();
  }
  
  const { baseFreq, waveform } = MATERIAL_SOUNDS[material];
  const avgResponse = data.response.reduce((sum: number, val: number) => sum + val, 0) / data.response.length;
  const frequencyOffset = avgResponse * 50;
  
  console.log(`[Audio] Playing ${material} sound: ${baseFreq + frequencyOffset}Hz (${waveform}), duration: ${duration}s`);
  // if (!synth) return;
  // synth.oscillator.type = waveform;
  // const currentTime = Tone.now();
  // synth.triggerAttackRelease(baseFreq + frequencyOffset, duration, currentTime);
}

/**
 * 刺激の強度に応じたクリック音
 */
export async function playStimulus(intensity: number): Promise<void> {
  if (!isInitialized) {
    await initAudio();
  }
  
  const freq = 800 + intensity * 200;
  console.log(`[Audio] Playing stimulus: ${freq}Hz`);
  // if (!synth) return;
  // synth.triggerAttackRelease(freq, 0.05);
}

/**
 * リソースのクリーンアップ
 */
export function disposeAudio(): void {
  console.log('[Audio] Disposing audio resources');
  // if (synth) {
  //   synth.dispose();
  //   synth = null;
  // }
  isInitialized = false;
}
