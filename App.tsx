import React, { useState, useEffect, useMemo } from 'react';
import { DrinkRecord } from './types';
import { calculateStats, getFormattedDate, getTopFrequency, parseDateString } from './utils';
import StatCard from './components/StatCard';
import RecordForm from './components/RecordForm';

const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
};

const SugarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M7 6h10" />
    <path d="M6 10h12" />
    <path d="M5 14h14" />
    <path d="M4 18h16" />
  </svg>
);

const IceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M4.9 4.9l14.2 14.2" />
    <path d="M19.1 4.9L4.9 19.1" />
  </svg>
);




const DEFAULT_SHOPS = ['50嵐', '一沐日', '五桐號', '迷客夏', '珍煮丹'];

type DetailType = 'MONTHLY_DOSE' | 'MONTHLY_FEE' | 'ANNUAL_DOSE' | 'ANNUAL_FEE';

const App: React.FC = () => {
  const [records, setRecords] = useState<DrinkRecord[]>(() => {
    const saved = localStorage.getItem('drink_records_2026');
    return saved ? JSON.parse(saved) : [];
  });

  const [shops, setShops] = useState<string[]>(() => {
    const saved = localStorage.getItem('drink_shops_2026');
    return saved ? JSON.parse(saved) : DEFAULT_SHOPS;
  });

  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(getFormattedDate(new Date()));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<'shop' | 'item' | null>(null);
  const [isDayOpen, setIsDayOpen] = useState(false);


  // ✅ 新增：四格明細的彈窗狀態
  const [detailType, setDetailType] = useState<DetailType | null>(null);

  useEffect(() => {
    localStorage.setItem('drink_records_2026', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('drink_shops_2026', JSON.stringify(shops));
  }, [shops]);

  const stats = useMemo(() => calculateStats(records, currentViewDate.getMonth()), [records, currentViewDate]);
  const favoriteShop = useMemo(() => getTopFrequency(records, 'shop'), [records]);
  const favoriteItem = useMemo(() => getTopFrequency(records, 'item'), [records]);

  const allAnalyticsData = useMemo(() => {
    if (!analyticsType) return [];
    const map = new Map<string, number>();
    records.forEach(r => {
      const val = r[analyticsType];
      map.set(val, (map.get(val) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [records, analyticsType]);

  const monthLabel = `${currentViewDate.getFullYear()} / ${String(currentViewDate.getMonth() + 1).padStart(2, '0')}`;
  const firstDayOfMonth = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));

  const addRecord = (newDrink: Omit<DrinkRecord, 'id' | 'date'>) => {
    if (!selectedDate) return;
    const record: DrinkRecord = { ...newDrink, id: crypto.randomUUID(), date: selectedDate };

    if (!shops.includes(newDrink.shop)) {
      setShops(prev => [...prev, newDrink.shop]);
    }

    setRecords(prev => [...prev, record]);
    setIsFormOpen(false);
  };

  const removeRecord = (id: string) => setRecords(prev => prev.filter(r => r.id !== id));
  const getRecordsForDate = (dateStr: string) => records.filter(r => r.date === dateStr);

  const handleDateClick = (dateStr: string) => {
  setSelectedDate(dateStr);
  setIsDayOpen(true);
};


  const colors = {
    blue: '#DCE4E9',
    purple: '#E7E4ED',
    sage: '#E5E9E4',
    pink: '#EFE8E8',
    dot: '#A8B8A8'
  };

  // ✅ 新增：當月/當年明細資料（用 currentViewDate 決定範圍）
  const monthlyRecords = useMemo(() => {
    const y = currentViewDate.getFullYear();
    const m = currentViewDate.getMonth();
    return records.filter(r => {
      const d = new Date(parseDateString(r.date));
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [records, currentViewDate]);

  const annualRecords = useMemo(() => {
    const y = currentViewDate.getFullYear();
    return records.filter(r => new Date(parseDateString(r.date)).getFullYear() === y);
  }, [records, currentViewDate]);

  const detailConfig = useMemo(() => {
    if (!detailType) return null;

    const isMonthly = detailType.startsWith('MONTHLY');
    const scopeRecords = isMonthly ? monthlyRecords : annualRecords;

    const titleMap: Record<DetailType, string> = {
      MONTHLY_DOSE: '當月劑量明細',
      MONTHLY_FEE: '當月診療費明細',
      ANNUAL_DOSE: '年度劑量明細',
      ANNUAL_FEE: '年度診療費明細'
    };

    const totalCost = Math.round(scopeRecords.reduce((acc, r) => acc + (Number(r.price) || 0), 0));

    return {
      title: titleMap[detailType],
      records: scopeRecords,
      summary: isMonthly
        ? `${monthLabel}｜共 ${scopeRecords.length} 杯｜總花費 $${totalCost}`
        : `${currentViewDate.getFullYear()}｜共 ${scopeRecords.length} 杯｜總花費 $${totalCost}`
    };
  }, [detailType, monthlyRecords, annualRecords, monthLabel, currentViewDate]);

  return (
    <div className="max-w-xl mx-auto px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] space-y-12">
      <div className="flex justify-center">
        <div className="bg-stone-600 px-14 py-6 rounded-full shadow-xl border border-stone-500 flex items-center space-x-3 transition-transform hover:scale-105 active:scale-95">
          <span className="text-xl font-black text-white tracking-[0.25em]">手搖成癮患者 🥤</span>
        </div>
      </div>

      <div className="space-y-2 px-2">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">2026 Case Report</p>
        <h2 className="text-2xl font-black text-stone-700 tracking-tight">2026 手搖成癮病歷表 📋</h2>
      </div>

      {/* 數據統計區（✅ 加上 onClick 進明細） */}
      <section className="grid grid-cols-2 gap-6">
        <StatCard
          label="Monthly Dose"
          subLabel="當月劑量"
          value={stats.monthlyCount}
          unit="杯"
          bgColor={colors.blue}
          textColor="text-stone-700"
          onClick={() => setDetailType('MONTHLY_DOSE')}
        />
        <StatCard
          label="Monthly Fee"
          subLabel="當月診療費"
          value={`$${stats.monthlyCost}`}
          unit=""
          bgColor={colors.purple}
          textColor="text-stone-700"
          onClick={() => setDetailType('MONTHLY_FEE')}
        />
        <StatCard
          label="Annual Dose"
          subLabel="年度劑量"
          value={stats.annualCount}
          unit="杯"
          bgColor={colors.sage}
          textColor="text-stone-700"
          onClick={() => setDetailType('ANNUAL_DOSE')}
        />
        <StatCard
          label="Annual Fee"
          subLabel="年度診療費"
          value={`$${stats.annualCost}`}
          unit=""
          bgColor={colors.pink}
          textColor="text-stone-700"
          onClick={() => setDetailType('ANNUAL_FEE')}
        />
      </section>

      {/* 日曆區 */}
      <section className="bg-white rounded-[4rem] p-10 card-shadow border border-stone-100">
        <div className="flex justify-between items-center mb-10 px-4">
          <button onClick={prevMonth} className="text-stone-300 hover:text-stone-600 transition-colors p-2"><Icons.ChevronLeft /></button>
          <h3 className="text-2xl font-black text-stone-600 font-mono tracking-tighter">{monthLabel}</h3>
          <button onClick={nextMonth} className="text-stone-300 hover:text-stone-600 transition-colors p-2"><Icons.ChevronRight /></button>
        </div>

        <div className="grid grid-cols-7 gap-y-6 text-center">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-[10px] font-black text-stone-400 tracking-[0.2em] pb-3">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dObj = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day);
            const dStr = getFormattedDate(dObj);
            const dayRecs = getRecordsForDate(dStr);
            const isSelected = selectedDate === dStr;
            const isToday = getFormattedDate(new Date()) === dStr;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(dStr)}
                className={`relative h-16 border border-transparent flex flex-col items-center justify-center transition-all duration-300 ${
                  isSelected ? 'bg-stone-100 rounded-[1.5rem] border-stone-200 z-10 scale-110 shadow-md' : 'hover:bg-stone-50 hover:rounded-[1.5rem]'
                }`}
              >
                <span className={`text-sm font-black ${isSelected ? 'text-stone-800' : isToday ? 'text-rose-400 underline underline-offset-8 decoration-2' : 'text-stone-400'}`}>
                  {day}
                </span>
                <div className="flex space-x-1 mt-2 h-4 items-center justify-center">
  {dayRecs.length >= 3 ? (
    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
  ) : (
    <>
      {dayRecs.length >= 1 && (
        <div style={{ backgroundColor: colors.dot }} className="w-1.5 h-1.5 rounded-full" />
      )}
      {dayRecs.length >= 2 && (
        <div style={{ backgroundColor: colors.dot }} className="w-1.5 h-1.5 rounded-full" />
      )}
    </>
  )}
</div>

              </button>
            );
          })}
        </div>
      </section>

      {/* 底部按鈕區 */}
      <section className="grid grid-cols-2 gap-6">
        <button onClick={() => setAnalyticsType('shop')} 
          style={{ backgroundColor: colors.blue }}className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 hover:brightness-[1.03]
 space-y-3 text-left transition-all active:scale-95">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Clinic Favorite</p>
          <p className="text-lg font-black text-stone-600 truncate">{favoriteShop.name}</p>
        </button>
        <button onClick={() => setAnalyticsType('item')} style={{ backgroundColor: colors.sage }}className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 hover:brightness-[1.03]
 space-y-3 text-left transition-all active:scale-95">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Addiction Item</p>
          <p className="text-lg font-black text-stone-600 truncate">{favoriteItem.name}</p>
        </button>
      </section>

      {/* ✅ 彈出視窗：四格明細 */}
      {detailConfig && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-xl p-0 sm:p-8">
          <div className="w-full max-w-lg bg-white rounded-t-[3.5rem] sm:rounded-[3.5rem] p-10 card-shadow max-h-[80vh] flex flex-col animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="pr-4">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">Details</p>
                <h3 className="text-2xl font-black text-stone-700">{detailConfig.title}</h3>
                <p className="text-xs font-bold text-stone-400 mt-2">{detailConfig.summary}</p>
              </div>
              <button onClick={() => setDetailType(null)} className="p-2 text-stone-300"><Icons.Close /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 pb-2">
              {detailConfig.records.length === 0 ? (
                <div className="p-6 bg-stone-50 rounded-[2rem] text-stone-400 font-bold">
                  尚無紀錄
                </div>
              ) : (
                detailConfig.records
                  .slice()
                  .sort((a, b) => parseDateString(b.date) - parseDateString(a.date))
                  .map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem]">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-stone-400">{r.date}</div>
                        <div className="font-black text-stone-700">{r.shop} {r.item}</div>
                        <div className="text-xs font-bold text-stone-400">{r.sweetness} / {r.ice}</div>
                      </div>
                      <div className="font-black text-stone-700">${Number(r.price) || 0}</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 彈出視窗：統計資料 */}
      {analyticsType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xl p-8">
          <div className="w-full max-w-lg bg-white rounded-[3.5rem] p-10 card-shadow animate-in zoom-in duration-300 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-stone-700">{analyticsType === 'shop' ? '店家統計' : '飲品統計'}</h3>
              <button onClick={() => setAnalyticsType(null)} className="p-2 text-stone-300"><Icons.Close /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
              {allAnalyticsData.map((data, idx) => (
                <div key={data.name} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem]">
                  <span className="font-bold text-stone-600">#{idx + 1} {data.name}</span>
                  <span className="text-sm font-black text-stone-400">{data.count} 次</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 彈出視窗：填寫表單 */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-xl p-0 sm:p-8">
          <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-500">
            <RecordForm
              onSave={addRecord}
              onCancel={() => setIsFormOpen(false)}
              existingCount={getRecordsForDate(selectedDate || '').length}
              availableShops={shops}
            />
          </div>
        </div>
      )}
{/* ✅ 彈出視窗：當天紀錄 */}
{isDayOpen && selectedDate && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/40 backdrop-blur-xl p-0 sm:p-8">
    <div className="w-full max-w-lg bg-white rounded-t-[3.5rem] sm:rounded-[3.5rem] p-10 card-shadow max-h-[80vh] flex flex-col animate-in zoom-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div className="pr-4">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">Daily Records</p>
          <h3 className="text-2xl font-black text-stone-700">
            {new Date(parseDateString(selectedDate)).toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </h3>
          <p className="text-xs font-bold text-stone-400 mt-2">
            共 {getRecordsForDate(selectedDate).length} 杯
          </p>
        </div>

      
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 pb-2">
        {getRecordsForDate(selectedDate).length === 0 ? (
          <div className="p-6 bg-stone-50 rounded-[2rem] text-stone-400 font-bold">
            今天還沒有紀錄 ✨
          </div>
        ) : (
          getRecordsForDate(selectedDate).map((r, i) => (
            <div key={r.id} className="bg-stone-50 p-6 rounded-[2rem] flex justify-between items-center">
              <div className="space-y-1 pr-4">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">
                  Prescription {i + 1}
                </p>
                <p className="font-black text-stone-700">
                  {r.shop} {r.item}
                </p>
                <p className="text-xs font-bold text-stone-400">
                  {r.sweetness} / {r.ice}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-black text-stone-700">${Number(r.price) || 0}</span>
                <button
                  onClick={() => removeRecord(r.id)}
                  className="p-2 text-stone-300 hover:text-rose-400 transition-colors"
                  aria-label="Delete"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer actions */}
      <div className="pt-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full py-6 border-2 border-dashed border-stone-200 rounded-[2.5rem] text-stone-500 flex items-center justify-center gap-3 hover:border-stone-400 hover:text-stone-700 transition-all bg-white"
        >
          <span className="p-2 rounded-full bg-stone-100">
            <Icons.Plus />
          </span>
          <span className="font-black text-sm tracking-[0.25em] uppercase">Add</span>
        </button>
      </div>
    </div>
  </div>
)}

      <footer className="pt-12 text-center">
        <p className="text-[10px] text-stone-400 uppercase tracking-[0.6em] font-black">Tea Addiction Clinic &copy; 2026</p>
      </footer>
    </div>
  );
};


export default App;
