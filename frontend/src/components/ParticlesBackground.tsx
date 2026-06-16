'use client';
import Particles, { ParticlesProvider, useParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

async function particlesInit(engine: Engine) {
  await loadSlim(engine);
}

const options: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 55, density: { enable: true } },
    color: { value: ['#f97316', '#fb923c', '#fbbf24', '#ffffff'] },
    opacity: {
      value: { min: 0.08, max: 0.45 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    size: {
      value: { min: 1, max: 2.5 },
      animation: { enable: true, speed: 1.5, sync: false },
    },
    links: {
      enable: true,
      distance: 160,
      color: '#f97316',
      opacity: 0.15,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      grab: { distance: 180, links: { opacity: 0.5 } },
      push: { quantity: 4 },
    },
  },
  detectRetina: true,
};

function ParticlesCanvas() {
  const { loaded } = useParticlesProvider();
  if (!loaded) return null;
  return (
    <Particles
      id="hero-particles"
      options={options}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}

export default function ParticlesBackground() {
  return (
    <ParticlesProvider init={particlesInit}>
      <ParticlesCanvas />
    </ParticlesProvider>
  );
}
