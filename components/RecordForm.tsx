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
  className="relative space-y-10 bg-white p-12 rounded-[3.5rem] card-shadow border border-stone-100 overflow-hidden max-h-[90vh] overflow-y-auto"
>
  {/* ✅ 右上角叉叉：永遠存在 */}
  <button
    type="button"
    onClick={onCancel}
    aria-label="Close"
    className="absolute top-6 right-6 p-2 rounded-full text-stone-300 hover:text-stone-600 hover:bg-stone-100 transition active:scale-95"
  >
    {/* 用你 App 裡那顆 Close SVG，直接貼過來 */}
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  </button>

  {/* 下面接你原本的內容 */}

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

      <div className="space-y-4">
        <div className="relative">
          <input
            list="shop-options"
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full bg-stone-50/80 p-6 rounded-2xl outline-none text-stone-700 placeholder:text-stone-300 border border-transparent focus:border-stone-200 transition-all text-lg"
            placeholder="點選或輸入店名..."
          />
          <datalist id="shop-options">
            {availableShops.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          {/* quick-select buttons */}
          <div className="mt-4 flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
            {availableShops.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShop(s)}
                className={`px-5 py-2 text-[10px] rounded-full border transition-all font-bold tracking-wider ${
                  shop === s
                    ? 'bg-stone-500 text-white border-stone-500 shadow-sm'
                    : 'bg-stone-50 text-stone-400 border-stone-100 hover:border-stone-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">
        Item / 品項
      </h3>
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="w-full bg-stone-50/80 p-6 rounded-2xl outline-none text-stone-700 placeholder:text-stone-300 border border-transparent focus:border-stone-200 transition-all text-lg"
        placeholder="藥方品項..."
      />

      {/* 甜度 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <SugarIcon />
          <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">
            Sugar / 甜度
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {SWEETNESS_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSweetness(level as SweetnessLevel)}
              className={[pillBase, sweetness === level ? pillOn : pillOff].join(' ')}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 冰塊 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IceIcon />
          <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">
            Ice / 冰量
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {ICE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setIce(level as IceLevel)}
              className={[pillBase, ice === level ? pillOn : pillOff].join(' ')}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-100/50 p-10 rounded-[3rem] flex justify-between items-center mt-6">
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-1">
            Medical Fee
          </p>
          <p className="text-base font-bold text-stone-600">診察費</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-stone-400 font-black text-2xl">$</span>
          <input
            type="number"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            className="w-28 bg-transparent text-right text-5xl font-black text-stone-700 outline-none placeholder:text-stone-200"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 pt-8">
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

