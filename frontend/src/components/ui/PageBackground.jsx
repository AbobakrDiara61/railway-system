import { motion } from 'framer-motion';

/**
 * PageBackground - A reusable component for consistent background styling across the app.
 * Centralizes image handling, overlays, and decorative glow effects.
 * 
 * @param {string} src - The image asset to display.
 * @param {number} opacity - The opacity level for the background image (default: 0.15).
 * @param {boolean} showGlows - Toggle decorative radial glow blobs (default: true).
 * @param {boolean} fixed - If true, uses fixed positioning instead of absolute (default: false).
 * @param {string} className - Optional additional classes.
 */
export function PageBackground({ 
  src, 
  opacity = 0.15, 
  showGlows = true, 
  fixed = false,
  className = "" 
}) {
  const positionClass = fixed ? "fixed" : "absolute";

  return (
    <div className={`${positionClass} inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* 1. Base Dark Background */}
      <div className="absolute inset-0 bg-[#070b14]" />

      {/* 2. The Background Image */}
      {src && (
        <img src={src} alt="" className="w-full h-full object-cover opacity-25" style={{opacity}}/>
      )}
      
      {/* 3. Darkening Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, rgba(7,11,20,0.8) 0%, rgba(7,11,20,0.25) 100%)' 
        }}
      />

      {/* 4. Decorative Glows (Rich Aesthetics) */}
      {showGlows && (
        <>
          {/* Primary Cyan Glow */}
          <div 
            className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px]"
            style={{ background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)' }} 
          />
          
          {/* Secondary Gold Glow */}
          <div 
            className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} 
          />

          {/* Tertiary Subtle Accents */}
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/[0.03] rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/[0.02] rounded-full" />
        </>
      )}
    </div>
  );
}
