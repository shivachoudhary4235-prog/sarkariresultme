import React from 'react';
import { usePortal } from '../context/PortalContext';

export const ActionGrid: React.FC = () => {
  const { featuredTiles, openNotification } = usePortal();

  const activeTiles = featuredTiles.filter((t) => t.active);

  return (
    <section aria-label="Featured Job Applications" className="w-full mb-5">
      {/* Hero Section of Top List: SARKARI RESULT */}
      <div className="w-full bg-[#ab1818] text-white text-center py-2.5 px-4 mb-3 border border-[#8a0c0c] shadow-xs">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider font-serif">
          SARKARI RESULT
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3.5">
        {activeTiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => openNotification(tile.slug)}
            style={{ backgroundColor: tile.bgColor }}
            className="text-white font-extrabold py-3.5 sm:py-4 px-2.5 text-center hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col justify-center items-center min-h-[76px] sm:min-h-[86px] md:min-h-[92px] shadow-sm cursor-pointer border border-black/20"
          >
            <span className="leading-snug px-1 font-black text-[15px] sm:text-[16px] md:text-[18px]">
              {tile.title}
            </span>
            <span
              style={{ color: tile.actionColor }}
              className="text-xs sm:text-[13.5px] md:text-[14.5px] font-black uppercase tracking-wider mt-1.5 px-2 py-0.5 bg-black/15"
            >
              {tile.actionText}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

