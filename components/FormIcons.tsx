import React from 'react';

export const SweetIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {/* ⬅️ 這裡放你「新增品項」原本那顆甜度 icon 的 path */}
  </svg>
);

export const IceIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {/* ⬅️ 這裡放你「新增品項」原本那顆冰塊 icon 的 path */}
  </svg>
);
