import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const FlickeringGrid = ({
  squareSize = 4,
  gridGap = 6,
  color = "#60A5FA",
  maxOpacity = 0.5,
  flickerChance = 0.1,
  className = "",
}) => {
  const [grid, setGrid] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateGrid = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const rows = Math.floor(height / (squareSize + gridGap));
      const cols = Math.floor(width / (squareSize + gridGap));

      const tempGrid = [];
      for (let i = 0; i < rows * cols; i++) {
        tempGrid.push({
          id: i,
          flicker: Math.random() < flickerChance,
          delay: Math.random() * 3,
        });
      }

      setGrid(tempGrid);
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [squareSize, gridGap, flickerChance]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${squareSize}px, 1fr))`,
        gap: `${gridGap}px`,
      }}
    >
      {grid.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: item.flicker ? [0, maxOpacity, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: item.delay,
          }}
          style={{
            width: squareSize,
            height: squareSize,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default FlickeringGrid;
