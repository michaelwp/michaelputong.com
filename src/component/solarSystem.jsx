import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {Html, Line, OrbitControls, Stars, Trail} from '@react-three/drei';
import * as THREE from 'three';
import UFO from "./ufo.jsx";

/**
 * OrbitLine Component
 * Renders a thin, transparent torus in the XZ plane to represent a planet's orbit.
 */
function OrbitLine({ orbitRadius }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbitRadius, 0.05, 2, 128]} />
            <meshBasicMaterial color="gray" transparent opacity={0.25} />
        </mesh>
    );
}

/**
 * Planet Component
 * Moves a planet along its orbit and rotates it.
 * On hover, the rotation pauses and the provided description is passed to the parent.
 */
function Planet({
                    orbitRadius,
                    orbitSpeed,
                    planetRadius,
                    color,
                    description,
                    initialAngle = 0,
                    rings = false,
                    onHover,
                    onLeave,
                    ufoActive,
                }) {
    const ref = useRef();
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
        if (!paused) {
            const elapsed = clock.getElapsedTime();
            const angle = initialAngle + elapsed * orbitSpeed;
            ref.current.position.x = orbitRadius * Math.cos(angle);
            ref.current.position.z = orbitRadius * Math.sin(angle);
            ref.current.rotation.y += 0.01;
        }
    });

    return (
        <group
            ref={ref}
            onPointerOver={(e) => {
                setPaused(true);
                setHovered(true);
                onHover && onHover(description);
            }}
            onPointerOut={(e) => {
                setPaused(false);
                setHovered(false);
                onLeave && onLeave();
            }}
        >
            <mesh>
                <sphereGeometry args={[planetRadius, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {rings && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[planetRadius * 1.2, planetRadius * 2, 32]} />
                    <meshStandardMaterial
                        color="white"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
            {/* Always render overlay for Earth to track its position */}
            {description.title === "Earth" && (
                <>
                    <Html
                        position={[planetRadius + 0.5, planetRadius + 0.5, 0]}
                        distanceFactor={10}
                        style={{ pointerEvents: "none", transform: "translate(-100%, -100%)" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "rgba(0,0,0,0.5)",
                                padding: "5px",
                                borderRadius: "5px",
                            }}
                        >
                            <img
                                src="/me.jpeg"
                                alt="me"
                                style={{
                                    width: "750px",
                                    height: "750px",
                                    borderRadius: "50%",
                                    marginRight: "50px",
                                    objectFit: "cover",
                                }}
                            />
                            <span style={{ color: ufoActive ? "red" : "whitesmoke", fontSize: "15em" }}>
                               {ufoActive ? "that's UFO !!" : "I live here!"}
                            </span>
                        </div>
                    </Html>
                    <Line
                        points={[
                            [0, 0, 0],
                            [planetRadius + 0.5 - 0.3, planetRadius + 0.5 - 0.3, 0]
                        ]}
                        color="whitesmoke"
                        lineWidth={1}
                    />
                </>
            )}
            {/* Optionally, you can still render your global hover overlay elsewhere */}
        </group>
    );
}

/**
 * Sun Component
 * Renders the Sun as an interactive object that shows its description on hover.
 */
function Sun({ planetRadius, color, description, onHover, onLeave }) {
    const ref = useRef();
    return (
        <group
            ref={ref}
            onPointerOver={(e) => {
                onHover(description);
            }}
            onPointerOut={(e) => {
                onLeave();
            }}
        >
            <mesh>
                <sphereGeometry args={[planetRadius, 32, 32]} />
                <meshStandardMaterial emissive={color} color={color} />
            </mesh>
        </group>
    );
}

/**
 * Comet Component
 * Renders a comet that moves in a random direction and leaves a fading tail.
 * The comet moves 2× faster than before.
 * When it moves off-screen, it calls onComplete.
 */
function Comet({ startPosition, speed, onComplete }) {
    const ref = useRef();
    const direction = useMemo(() => {
        const vec = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
        return vec.normalize();
    }, []);

    useEffect(() => {
        if (ref.current) {
            ref.current.position.copy(startPosition);
        }
    }, [startPosition]);

    useFrame((state, delta) => {
        ref.current.position.addScaledVector(direction, speed * 2 * delta);
        if (ref.current.position.length() > 1000) {
            onComplete();
        }
    });

    return (
        <Trail local width={1} length={20} decay={2} color="white">
            <mesh ref={ref}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </Trail>
    );
}

/**
 * CometRain Component
 * Spawns new comets at random intervals (between 5 and 20 seconds) with random start positions.
 */
function CometRain() {
    const [comets, setComets] = useState([]);

    const addComet = () => {
        const id = Date.now();
        const start = new THREE.Vector3(
            (Math.random() - 0.5) * 600,
            300,
            (Math.random() - 0.5) * 600
        );
        const speed = Math.random() * 10 + 5;
        setComets((prev) => [...prev, { id, start, speed }]);
    };

    useEffect(() => {
        let active = true;
        const scheduleNext = () => {
            if (!active) return;
            const delay = Math.random() * 15000 + 5000;
            setTimeout(() => {
                addComet();
                scheduleNext();
            }, delay);
        };
        scheduleNext();
        return () => { active = false; };
    }, []);

    return (
        <>
            {comets.map((comet) => (
                <Comet
                    key={comet.id}
                    startPosition={comet.start}
                    speed={comet.speed}
                    onComplete={() => setComets((prev) => prev.filter((c) => c.id !== comet.id))}
                />
            ))}
        </>
    );
}

// Cube-root scaling compresses the vast differences in sizes while preserving relative proportions.
const scaleRadius = (r) => Math.cbrt(r);

// Planet data: relative radii (with Earth = 1), chosen orbit distances, brighter colors,
// and a description for each planet including distance and moon details.
const planetData = {
    Mercury: {
        radius: 0.38,
        orbit: 8,
        color: "#d3d3d3",
        orbitSpeed: 0.5,
        description: {
            title: "Mercury",
            size: "Size: 0.38 (Earth = 1)",
            distance: "Distance from Sun: 8 AU, from Earth: 8 AU",
            moons: "Moons: None.",
            funFact: "Fun Fact: Mercury has a very thin atmosphere."
        },
    },
    Venus: {
        radius: 0.95,
        orbit: 12,
        color: "#ffcc66",
        orbitSpeed: 0.35,
        description: {
            title: "Venus",
            size: "Size: 0.95 (Earth = 1)",
            distance: "Distance from Sun: 12 AU, from Earth: 4 AU",
            moons: "Moons: None.",
            funFact: "Fun Fact: Venus rotates in the opposite direction to most planets."
        },
    },
    Earth: {
        radius: 1,
        orbit: 16,
        color: "#00aaff",
        orbitSpeed: 0.3,
        description: {
            title: "Earth",
            size: "Size: 1",
            distance: "Distance from Sun: 16 AU, from Earth: 0 AU",
            moons: "Moons: 1 (Moon).",
            funFact: "Fun Fact: Earth is the only planet known to support life."
        },
    },
    Mars: {
        radius: 0.53,
        orbit: 20,
        color: "#ff5733",
        orbitSpeed: 0.25,
        description: {
            title: "Mars",
            size: "Size: 0.53",
            distance: "Distance from Sun: 20 AU, from Earth: 4 AU",
            moons: "Moons: 2 (Phobos, Deimos).",
            funFact: "Fun Fact: Mars has the largest volcano in the solar system."
        },
    },
    Jupiter: {
        radius: 11.2,
        orbit: 24,
        color: "#ffcc00",
        orbitSpeed: 0.2,
        description: {
            title: "Jupiter",
            size: "Size: 11.2",
            distance: "Distance from Sun: 24 AU, from Earth: 8 AU",
            moons: "Moons: 79 (including Io, Europa, Ganymede, Callisto).",
            funFact: "Fun Fact: Jupiter has a giant storm called the Great Red Spot."
        },
    },
    Saturn: {
        radius: 9.45,
        orbit: 28,
        color: "#ffd700",
        orbitSpeed: 0.17,
        description: {
            title: "Saturn",
            size: "Size: 9.45",
            distance: "Distance from Sun: 28 AU, from Earth: 12 AU",
            moons: "Moons: 82 (including Titan, Enceladus, Rhea).",
            funFact: "Fun Fact: Saturn is famous for its stunning ring system."
        },
    },
    Uranus: {
        radius: 4,
        orbit: 32,
        color: "#66ccff",
        orbitSpeed: 0.15,
        description: {
            title: "Uranus",
            size: "Size: 4",
            distance: "Distance from Sun: 32 AU, from Earth: 16 AU",
            moons: "Moons: 27 (including Titania, Oberon, Umbriel, Ariel, Miranda).",
            funFact: "Fun Fact: Uranus rotates on its side."
        },
    },
    Neptune: {
        radius: 3.88,
        orbit: 36,
        color: "#3399ff",
        orbitSpeed: 0.13,
        description: {
            title: "Neptune",
            size: "Size: 3.88",
            distance: "Distance from Sun: 36 AU, from Earth: 20 AU",
            moons: "Moons: 14 (including Triton, Nereid).",
            funFact: "Fun Fact: Neptune has the strongest winds in the solar system."
        },
    },
};

// Sun data: includes detailed description with moon details.
const sunData = {
    radius: 109,
    description: {
        title: "Sun",
        size: "Size: 109 (Earth = 1)",
        distance: "Distance: 0 AU (Center of Solar System)",
        moons: "Moons: None.",
        funFact: "Fun Fact: The Sun contains 99.86% of the solar system's mass."
    },
};

function SolarSystem() {
    const [ufoActive, setUfoActive] = useState(false);
    const [hoverDescription, setHoverDescription] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleHover = (desc) => {
        setHoverDescription(desc);
    };

    const handleLeave = () => {
        setHoverDescription(null);
    };

    return (
        <div
            style={{ position: "relative", width: "100%", height: "100%" }}
            onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
        >
            {/* Static header overlay in the top-left corner with photo and mail icon */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    zIndex: 2,
                    fontFamily: "Arial, sans-serif",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "top",
                }}
            >
                <img
                    src="/profile.jpeg"
                    alt="Profile"
                    style={{
                        width: "125px",
                        height: "125px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        objectFit: "cover",
                    }}
                />
                <div>
                    <p style={{ margin: "0 0 10px 0", fontSize: "1.5em", color: "beige" }}>
                        Welcome to my Space
                    </p>
                    <h1 style={{ margin: "0 0 5px 0", fontSize: "2em" }}>
                        Michael Wenceslaus Putong
                    </h1>
                    <p style={{ margin: "0 0 5px 0", fontSize: "1.7em", color: "gray" }}>
                        Fullstack Engineer
                    </p>
                    <p style={{ margin: "5px 0 0 0", paddingTop: "10px", fontSize: "1em", color: "aqua", borderTop: "1px solid gray" }}>
                        <div>Contact: <a href="mailto:me@michaelputong.com">me@michaelputong.com</a></div>
                        <div>Linkedin: <a href="https://www.linkedin.com/in/michael-wenceslaus/">michael-wenceslaus</a></div>
                        <div>Github: <a href="https://github.com/michaelwp">michaelwp</a></div>
                    </p>
                </div>
            </div>

            {/* Static footer overlay in the bottom-right corner */}
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    color: "whitesmoke",
                    fontSize: "0.9em",
                    fontFamily: "Arial, sans-serif",
                    zIndex: 2,
                }}
            >
                powered by NASI@2025
            </div>

            {/* Dynamic hover description overlay */}
            {hoverDescription && (
                <div
                    style={{
                        position: "absolute",
                        left: mousePosition.x,
                        top: mousePosition.y,
                        transform: "translate(0, -100%)", // Shift upward so the left-bottom corner is at the mouse
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "15px",
                        borderRadius: "8px",
                        zIndex: 1,
                        maxWidth: "300px",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "1em",
                        lineHeight: "1.2em"
                    }}
                >
                    {typeof hoverDescription === "object" ? (
                        <>
                            <h2 style={{ margin: "0 0 10px 0", fontSize: "2em" }}>
                                {hoverDescription.title}
                            </h2>
                            <p style={{ margin: "5px 0" }}>{hoverDescription.size}</p>
                            <p style={{ margin: "5px 0" }}>{hoverDescription.distance}</p>
                            <p style={{ margin: "5px 0" }}>{hoverDescription.moons}</p>
                            <p style={{ margin: "5px 0" }}>{hoverDescription.funFact}</p>
                        </>
                    ) : (
                        <p>{hoverDescription}</p>
                    )}
                </div>
            )}
            <Canvas style={{ background: "black" }} camera={{ position: [0, 50, 100], fov: 60 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[0, 0, 0]} intensity={1.5} />
                <Stars
                    radius={5}
                    depth={50}
                    count={20000}
                    factor={1}
                    saturation={0}
                    fade
                />
                {Object.entries(planetData).map(([name, data]) => (
                    <React.Fragment key={name}>
                        <OrbitLine orbitRadius={data.orbit} />
                        <Planet
                            orbitRadius={data.orbit}
                            orbitSpeed={data.orbitSpeed}
                            planetRadius={scaleRadius(data.radius)}
                            color={data.color}
                            description={data.description}
                            rings={name === "Saturn"}
                            onHover={handleHover}
                            onLeave={handleLeave}
                            ufoActive={ufoActive}
                        />
                    </React.Fragment>
                ))}
                <Sun
                    planetRadius={scaleRadius(sunData.radius)}
                    color="#ffcc00"
                    description={sunData.description}
                    onHover={handleHover}
                    onLeave={handleLeave}
                />
                <CometRain />
                {/* pass both callbacks to UFO */}
                <UFO
                    onAppear={() => setUfoActive(true)}
                    onDisappear={() => setUfoActive(false)}
                />
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default SolarSystem;