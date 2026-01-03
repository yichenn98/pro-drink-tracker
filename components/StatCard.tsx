import React from 'react';

interface StatCardProps {
  label: string;
  subLabel: string;
  value: string | number;
  unit: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  subLabel,
  value,
  unit,
  bgColor,
  textColor,
  onClick
}) => {
  const clickable = typeof onClick === 'function';

  return (
    <div
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        p-8
        rounded-[2.5rem]
        card-shadow
        flex flex-col
        justify-between
        aspect-square
        transition-all
        hover:scale-[1.05]
        hover:shadow-lg
        group
        ${clickable ? 'cursor-pointer active:scale-95' : ''}
      `}
    >
      <div>
        <p className="text-[10px] font-black tracking-[0.25em] opacity-40 uppercase mb-1">
          {label}
        </p>
        <p className="text-base font-bold text-stone-600 opacity-90">
          {subLabel}
        </p>
      </div>

      <div className="mt-auto flex items-baseline space-x-2">
        <span className={`text-4xl font-black tracking-tighter ${textColor}`}>
          {value}
        </span>
        <span className={`text-sm opacity-60 font-black ${textColor}`}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

