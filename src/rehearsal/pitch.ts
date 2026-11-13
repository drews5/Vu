export function playPitch(midi: number, context: AudioContext) {
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  const now = context.currentTime;
  oscillator.type = 'sine';
  oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
  volume.gain.setValueAtTime(0, now);
  volume.gain.linearRampToValueAtTime(.15, now + .04);
  volume.gain.setValueAtTime(.15, now + .45);
  volume.gain.exponentialRampToValueAtTime(.001, now + .78);
  oscillator.connect(volume).connect(context.destination);
  oscillator.start();
  oscillator.stop(now + .8);
}

export const pitchNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
