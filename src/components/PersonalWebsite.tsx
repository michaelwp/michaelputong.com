import React, {useEffect, useRef, useState} from 'react';
import {
    FaLinkedin,
    FaGithub,
    FaEnvelope,
    FaDownload,
    FaPencilAlt,
    FaSun,
    FaMoon,
} from 'react-icons/fa';

const PersonalWebsite: React.FC = () => {
    const fullName = 'Michael Wenceslaus';
    const [displayedName, setDisplayedName] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [summary] = useState(' I craft scalable, high-performance web applications with clean and maintainable code. With over 13 years in the tech industry, my core strengths lie in backend development using Go, JavaScript, and TypeScript, delivering practical solutions to complex challenges.');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        let index = 0;
        let display = '';
        let typingInterval: number;
        let loopInterval: number;

        const type = () => {
            index = 0;
            display = '';
            setDisplayedName('');
            typingInterval = window.setInterval(() => {
                if (index < fullName.length) {
                    display += fullName[index];
                    setDisplayedName(display);
                    index++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 100);
        };

        type(); // run once
        loopInterval = window.setInterval(type, 15000); // run every minute

        return () => {
            clearInterval(typingInterval);
            clearInterval(loopInterval);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let stars = Array(200)
            .fill(null)
            .map(() => ({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
            }));

        let mouseX = 0;
        let mouseY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX - width / 2) / width;
            mouseY = (e.clientY - height / 2) / height;
        };

        const animate = () => {
            ctx.fillStyle = darkMode ? 'black' : 'white';
            ctx.fillRect(0, 0, width, height);
            for (const star of stars) {
                star.z -= 1.5;
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * width;
                    star.y = (Math.random() - 0.5) * height;
                    star.z = width;
                }
                const k = 128.0 / star.z;
                const px = star.x * k + width / 2 + mouseX * 100;
                const py = star.y * k + height / 2 + mouseY * 100;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                    const size = (1 - star.z / width) * 2;
                    ctx.fillStyle = darkMode ? 'white' : 'black';
                    ctx.fillRect(px, py, size, size);
                }
            }
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', onMouseMove);
        animate();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [darkMode]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-white text-black dark:bg-black dark:text-white">
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0"/>

            <main
                className="relative z-10 min-h-screen font-sans flex flex-col items-center justify-center p-4 transition-opacity duration-1000">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-5 right-5 text-black dark:text-white text-2xl hover:scale-110 transition-transform"
                    title="Toggle Dark Mode"
                >
                    {darkMode ? <FaSun/> : <FaMoon/>}
                </button>

                <section className="text-center max-w-2xl">
                    <img
                        src="/profile.png"
                        alt="Michael Wenceslaus"
                        className="w-32 h-32 border-2 dark:border-amber-100 border-gray-600 rounded-full mx-auto mb-6 shadow-md transition-transform duration-300 hover:scale-110"
                    />
                    <h1 className="text-4xl font-bold mb-4">
                        <span>{displayedName}</span>
                        {displayedName.length < fullName.length && (
                            <span className="inline-block w-[1px] h-6 bg-current align-middle animate-pulse ml-1"/>
                        )}
                    </h1>
                    <p className="text-lg mb-6">Full-Stack Engineer | Problem Solver | Tech Enthusiast</p>
                    <p className="text-base text-gray-800 dark:text-gray-300">
                        {summary}
                    </p>
                </section>

                <section className="mt-10 flex gap-4 flex-wrap justify-center">
                    <a href="https://www.linkedin.com/in/michael-wenceslaus/" target="_blank"
                       className="text-blue-700 dark:text-blue-400 text-2xl"
                       title="LinkedIn"><FaLinkedin/></a>
                    <a href="https://github.com/michaelwp" target="_blank"
                       className="text-gray-900 dark:text-white text-2xl"
                       title="GitHub"><FaGithub/></a>
                    <a href="mailto:me@michaelputong.com" target="_blank" className="text-red-500 dark:text-red-400 text-2xl"
                       title="Email"><FaEnvelope/></a>
                    <a href="/cv.pdf" target="_blank" className="text-gray-900 dark:text-white text-2xl"
                       title="Download CV"><FaDownload/></a>
                    <a href="https://goblog.dev" target="_blank" className="text-green-700 dark:text-green-400 text-2xl"
                       title="Blog"><FaPencilAlt/></a>
                </section>

                <footer className="mt-16 text-sm text-gray-600 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Michael Wenceslaus
                </footer>
            </main>
        </div>
    );
};

export default PersonalWebsite;
