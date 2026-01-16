import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 渐变定义 */}
    <defs>
      <linearGradient id="shieldGradient" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
        <stop offset="100%" stopColor="#2563EB" /> {/* blue-600 */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* 盾牌背景：代表安全与治理 */}
    <path
      d="M20 4L34 10V20C34 29 28 36 20 39C12 36 6 29 6 20V10L20 4Z"
      fill="url(#shieldGradient)"
      stroke="#1D4ED8"
      strokeWidth="1"
    />

    {/* 内部高光，增加立体感 */}
    <path
      d="M20 5L32 10.5V20C32 27.5 27 33.5 20 36C13 33.5 8 27.5 8 20V10.5L20 5Z"
      fill="white"
      fillOpacity="0.1"
    />

    {/* AI 脉冲波形：代表智能检测与语音分析 */}
    <path
      d="M11 21H14L17 13L23 29L26 21H29"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#glow)"
    />
    
    {/* 右上角的小圆点，代表 Insight/洞察点 */}
    <circle cx="28" cy="12" r="2.5" fill="#60A5FA" stroke="white" strokeWidth="1" />
  </svg>
);
