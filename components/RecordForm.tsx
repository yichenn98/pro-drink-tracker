import { SweetIcon, IceIcon } from './FormIcons';
import React, { useState } from 'react';
import { DrinkRecord, IceLevel, SweetnessLevel } from '../types';
import { ICE_LEVELS, SWEETNESS_LEVELS } from '../constants';

interface RecordFormProps {
  onSave: (record: Omit<DrinkRecord, 'id' | 'date'>) => void;
  onCancel: () => void;
  existingCount: number;
  availableShops: string[];
}

// 小 icon（輕量，不用額外套件）
const SugarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    className="text-stone-400"
    aria-hidden="true"
  >
    <path
      d="M12 2C12 2 6 9 6 13.5C6 17.0899 8.91015 20 12.5 20C16.0899 20 19 17.0899 19 13.5C19 9 12 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const IceIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    className="text-stone-400"
    aria-hidden="true"
  >
    <path
      d="M12 2v20M4 6l16 12M20 6L4 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RecordForm: React.FC<RecordFormProps> = ({
  onSave,
  onCancel,
  existingCount,
  availableShops
}) => {
  const [shop, setShop] = useState('');
  const [item, setItem] = useState('');

  // ✅ 新選項建議預設為「固定」，避免預設值不在清單造成 UI 沒有被選中
  const [ice, setIce] = useState<IceLevel>('固定' as IceLevel);
  const [sweetness, setSweetness] = useState<SweetnessLevel>('固定' as SweetnessLevel);

  const [priceStr, setPriceStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!shop || !item) return;

  if (existingCount === 0 && sweetness !== '無糖') {
    alert('別再喝了！！減肥減肥減肥！！！😤');
  }

  onSave({
    shop,
    item,
    ice,
    sweetness,
    price: Number(priceStr) || 0
  });

  onCancel(); // ✅ 存完自動關掉視窗
};


  // ✅ 甜度/冰塊按鈕統一尺寸（字 + 框都小一點）
  const pillBase =
    'px-3 h-9 min-w-[64px] rounded-xl text-[11px] font-bold tracking-[0.1em] border-2 transition-all flex items-center justify-center';
  const pillOn = 'bg-stone-600 text-white border-stone-600 shadow-sm';
  const pillOff = 'bg-white text-stone-500 border-stone-200 hover:border-stone-400';

 return (
  <form
    onSubmit={handleSubmit}
    className="relative bg-white rounded-[3.5rem] card-shadow border border-stone-100
               max-h-[85vh] flex flex-col overflow-hidden"
  >
    {/* ✅ 右上角叉叉：永遠固定 */}
    <button
      type="button"
      onClick={onCancel}
      aria-label="Close"
      className="absolute top-6 right-6 z-10 p-2 rounded-full text-stone-300 hover:text-stone-600 hover:bg-stone-100 transition active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>

    {/* ✅ 只有這裡可以滾 */}
    <div className="flex-1 overflow-y-auto overscroll-contain p-12 space-y-10 custom-scrollbar">
      {/* ====== 把你原本的內容全部放進這裡 ======
          從「Store / 店名」開始
          到「Medical Fee」那一大段結束
      */}

      {/* 例如： */}
      <div className="flex items-center justify-between">
        <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">
          Store / 店名
        </h3>
        {existingCount > 0 && (
          <span className="text-[10px] bg-stone-200 text-stone-600 px-4 py-1.5 rounded-full font-bold tracking-widest uppercase">
            Dose 2 🩵
          </span>
        )}
      </div>

      {/* ⚠️ 你後面所有 input、甜度、冰塊、金額區塊照貼在這裡（跟你原本一樣） */}
      {/* ...（把你原本 JSX 繼續貼在這）... */}

    </div>

    {/* ✅ 底部固定：Save 不跟著滾 */}
    <div className="shrink-0 p-12 pt-0">
      <button
        type="submit"
        className="w-full py-8 px-8 bg-stone-700 text-white rounded-[2.2rem] font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95 leading-none"
      >
        Save
      </button>
    </div>
  </form>
);

};

export default RecordForm;

