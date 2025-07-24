
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef, useMemo } from 'react';

const vertexShader = `
  varying vec2 vUv;
  uniform float u_time;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_progress;

  void main() {
    vec2 uv = vUv;
    float glitch = sin(u_progress * 10.0 + uv.y * 20.0) * 0.05;
    uv.x += glitch;

    // Bend effect based on scroll
    float bend = sin(u_progress * 3.14159) * 0.2;
    uv.y = uv.y * (1.0 - bend) + bend * 0.5;

    gl_FragColor = texture2D(u_texture, uv);
  }
`;

export default function ImagePlane({ src, position, scale, scrollProgress }) {
  const ref = useRef();
  const texture = useTexture(src);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0 },
      u_texture: { value: texture },
    }),
    [texture]
  );

  useFrame((state, delta) => {
    ref.current.material.uniforms.u_time.value += delta;
    // We will pass the scroll progress directly as a prop
    ref.current.material.uniforms.u_progress.value = scrollProgress;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
}
