import React, { useRef, useEffect } from 'react';
import { useTheme } from './../components/ThemeHandler';

const Effect: React.FC = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context: any = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let f = 0; // Frame counter
    const nbFrames = 400; // Number of frames for animation
    const easing = 0.01; // Easing factor for smooth transitions
    let c1: string, c2: string; // Colors for background and objects

    // Data for random configurations
    const data = [
      //{ lx: 9, ly: 8, coef: 11, divAngle: 7, nbP: 7, a1: 5, a2: 9 },
      { lx: 9, ly: 8, coef: 13, divAngle: 7, nbP: 7, a1: 5, a2: 9 }, //
      { lx: 7, ly: 6, coef: 14, divAngle: 8, nbP: 7, a1: 3, a2: 6 }, //
      { lx: 9, ly: 4, coef: 11, divAngle: 6, nbP: 7, a1: 5, a2: 9 }, //
      //{ lx: 6, ly: 6, coef: 12, divAngle: 6, nbP: 7, a1: 10, a2: 10 }, /
      //{ lx: 7, ly: 8, coef: 13, divAngle: 8, nbP: 7, a1: 10, a2: 7 }, /
      //{ lx: 7, ly: 6, coef: 12, divAngle: 6, nbP: 7, a1: 5, a2: 9 }, /
      //{ lx: 6, ly: 7, coef: 11, divAngle: 6, nbP: 7, a1: 8, a2: 5 },
      { lx: 7, ly: 9, coef: 13, divAngle: 7, nbP: 7, a1: 9, a2: 6 }, //
      { lx: 9, ly: 9, coef: 14, divAngle: 5, nbP: 7, a1: 10, a2: 7 }, //
      { lx: 8, ly: 4, coef: 14, divAngle: 8, nbP: 7, a1: 4, a2: 9 }, //
      { lx: 9, ly: 9, coef: 11, divAngle: 5, nbP: 7, a1: 4, a2: 6 } //
    ];

    // Initial parameters
    const params = {
      lx: 9, ly: 9, coef: 14, divAngle: 5, nbP: 10, a1: 10, a2: 7,
    };

    // Assign random data to parameters
    function assignTabData(data: typeof params[], params: any) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const datas = data[randomIndex];
      const keys = Object.keys(params) as (keyof typeof params)[];
      Object.values(datas).forEach((value, index) => {
        if (keys[index] !== undefined) {
          params[keys[index]] = value;
        }
      });
    }

    let currentLx = params.lx;
    let currentLy = params.ly;
    let currentA1 = params.a1;
    let currentA2 = params.a2;
    let currentCoef = params.coef;
    let currentDivAngle = params.divAngle;

    assignTabData(data, params);

    // Change colors based on theme
    function changeColors() {
      //let theme = localStorage.getItem('theme');
      //theme = "dark";
      if (theme === 'theme-dark') {
        c1 = '#1A1A1A'; // Background color
        c2 = '#2e2e2e'; // Font color
      } else {
        c1 = '#F6F6F6';
        c2 = '#cccccc';
      }
    }

    // Store characters to prevent them from changing
    const characters: string[][] = Array.from({ length: params.nbP }, () => 
      Array.from({ length: params.nbP }, () => Math.random() > 0.5 ? 'x' : 'o')
    );

    // Draw function for animation
    function draw() {
      currentLx += (params.lx - currentLx) * easing;
      currentLy += (params.ly - currentLy) * easing;
      currentA1 += (params.a1 - currentA1) * easing;
      currentA2 += (params.a2 - currentA2) * easing;
      currentCoef += (params.coef - currentCoef) * easing;
      currentDivAngle += (params.divAngle - currentDivAngle) * easing;

      const colFond = c1
      const colObjt = c2;

      context.fillStyle = colFond;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = colObjt;

      for (let i = 0; i < params.nbP; i++) {
        let p = (i + (f / nbFrames) % 1) / params.nbP;
        let angle = (p * Math.PI * 2) / currentDivAngle;

        for (let j = 0; j < params.nbP; j++) {
          let a = (j * Math.PI * 2) / params.nbP;
          let rad = 0.5; // Radius of the effect
          let r = 1 + Math.sin((angle * currentCoef) / 2) * 2;

          context.save();
          context.translate(
            canvas.width / 2 + (Math.sin(a + angle * currentLx) * canvas.height / 1.5 * rad) + (Math.sin(a + angle * currentA1) * 100),
            canvas.height / 2 + (Math.cos(a + angle * currentLy) * canvas.height / 1.5 * rad) + (Math.cos(a + angle * currentA1) * 100)
          );
          context.font = `600 ${r * 14}px Rubik`;
          context.fillText(characters[i][j], 0, 0);
          context.restore();
        }
      }

      f++;
      requestAnimationFrame(draw);
    }

    // Setup function to initialize canvas and start drawing
    function setup() {
      changeColors();
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight;
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
      draw();
    }

    setup();
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: -100, left: 0, zIndex: -2 }} />;
};

export default Effect;