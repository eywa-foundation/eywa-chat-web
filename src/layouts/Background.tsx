import { Box } from '@mantine/core';
import { useEffect, useRef } from 'react';

const Background = ({ children }: React.PropsWithChildren) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasEl.current;
    if (!canvas) return;
  }, []);

  useEffect(() => {
    const canvas = canvasEl.current;
    const ctx = canvasEl.current?.getContext('2d');
    if (!canvas || !ctx) return;

    let cancelled = false;

    const starSize = 0.8;
    const starSpeed = 6e-2;
    const starColor = '#ffffff';

    const stars = [...Array(400)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));

    const resize = () => {
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;
      stars.forEach((star) => {
        star.x = Math.random() * window.innerWidth;
        star.y = Math.random() * window.innerHeight;
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = starColor;
      ctx.beginPath();
      stars.forEach((star) => {
        star.x -= starSpeed;
        if (star.x < 0) star.x = window.innerWidth + starSize;
      });
      stars.forEach((star) => {
        ctx.moveTo(star.x, star.y);
        ctx.arc(star.x, star.y, starSize, 0, 2 * Math.PI);
      });
      ctx.fill();
    };

    const animate = () => {
      draw();
      if (cancelled) return;
      window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelled = true;
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box h="100%">
      <canvas style={{ position: 'fixed', zIndex: 1 }} ref={canvasEl} />
      <Box h="100%" style={{ zIndex: 2, position: 'relative' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Background;
