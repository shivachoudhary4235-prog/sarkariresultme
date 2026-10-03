'use client';

import React from 'react';
import { usePortal } from '../context/PortalContext';
import type { TickerItem } from '@sarkari/shared-types';

interface TickerProps {
  items?: TickerItem[];
}

export const Ticker: React.FC<TickerProps> = ({ items: propItems }) => {
  const portalContext = usePortal();
  const tickerItems = propItems ?? portalContext.tickerItems;
  const { openNotification } = portalContext;

  const activeItems = tickerItems.filter((item) => item.active);

  // Group items into rows for desktop as seen in Image 5 & 7
  const row1 = activeItems.slice(0, 3);
  const row2 = activeItems.slice(3, 6);
  const row3 = activeItems.slice(6, 9);

  const handleItemClick = (item: (typeof activeItems)[0]) => {
    if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      openNotification(item.targetSlug || item.url);
    }
  };

  const renderTickerButton = (item: (typeof activeItems)[0]) => (
    <button
      onClick={() => handleItemClick(item)}
      className="text-[#000dff] hover:text-[#ab1818] hover:underline font-extrabold mx-3 cursor-pointer transition-colors inline-flex items-center gap-1.5"
    >
      {item.badge && (
        <span className="bg-[#d32f2f] text-white text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider rounded-[1px] animate-pulse">
          {item.badge}
        </span>
      )}
      <span>{item.title}</span>
    </button>
  );

  return (
    <div className="w-full bg-[#fee2de] border border-[#f9dcd9] rounded-none p-2 mb-3.5 overflow-hidden">
      {/* Top Alert Header */}
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span className="bg-[#850008] text-white text-xs font-black px-2.5 py-0.5 uppercase tracking-wider">
          Breaking Alert
        </span>
        <span className="text-[#850008] text-[13px] md:text-sm font-extrabold flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d32f2f] animate-ping" />
          ● LIVE UPDATES:
        </span>
      </div>

      {/* Floating Left-to-Right Moving Blue Ticker Bands */}
      <div className="flex flex-col gap-1.5 text-center font-bold text-[13.5px] md:text-[14.5px]">
        {/* Row 1 */}
        {row1.length > 0 && (
          <div className="overflow-hidden py-1">
            <div className="floating-blue-ticker whitespace-nowrap">
              {row1.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {renderTickerButton(item)}
                  {idx < row1.length - 1 && <span className="text-gray-400 font-normal">||</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Row 2 */}
        {row2.length > 0 && (
          <div className="overflow-hidden py-1">
            <div
              className="floating-blue-ticker whitespace-nowrap"
              style={{ animationDelay: '-1.5s' }}
            >
              {row2.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {renderTickerButton(item)}
                  {idx < row2.length - 1 && <span className="text-gray-400 font-normal">||</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Row 3 */}
        {row3.length > 0 && (
          <div className="overflow-hidden py-1">
            <div
              className="floating-blue-ticker whitespace-nowrap"
              style={{ animationDelay: '-3s' }}
            >
              {row3.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {renderTickerButton(item)}
                  {idx < row3.length - 1 && <span className="text-gray-400 font-normal">||</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
