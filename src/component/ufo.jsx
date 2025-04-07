import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function UFO({ onAppear, onDisappear }) {
    const ref = useRef();
    const [active, setActive] = useState(false);
    const startTime = useRef(null);

    // Schedule a new pass every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            startTime.current = null;
            setActive(true);
            onAppear && onAppear();
        }, 15000);
        return () => clearInterval(interval);
    }, [onAppear]);

    useFrame(({ clock }, delta) => {
        if (!active) return;
        if (startTime.current === null) startTime.current = clock.getElapsedTime();
        const elapsed = clock.getElapsedTime() - startTime.current;
        const duration = 3; // cross in 3s
        const progress = elapsed / duration;

        // fly from +100 → -100
        ref.current.position.set(
            THREE.MathUtils.lerp(100, -100, progress),
            20,
            0
        );
        ref.current.rotation.y += delta * 10;

        if (progress >= 1) {
            setActive(false);
            onDisappear && onDisappear();
        }
    });

    if (!active) return null;
    return (
        <group ref={ref} scale={[0.1, 0.1, 0.1]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5, 1.5, 16, 100]} />
                <meshStandardMaterial color="silver" emissive="lightblue" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial color="lightblue" transparent opacity={0.6} />
            </mesh>
        </group>
    );
}