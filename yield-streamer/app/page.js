'use client';
import { useState, useEffect, useRef } from 'react';

export default function YieldStreamer() {
  const ASSETS = [
    { id: 'office', name: 'Office Tower', emoji: '🏢', apr: 8 },
    { id: 'solar', name: 'Solar Farm', emoji: '🔆', apr: 12 },
    { id: 'invoice', name: 'Invoice Pool', emoji: '📄', apr: 18 },
    { id: 'gold', name: 'Gold Vault', emoji: '🥇', apr: 5 }
  ];

  const TICK_MS = 1000;
  const TICKS_IN_YEAR = 60;

  const [wallet, setWallet] = useState(1000);
  const [asset, setAsset] = useState(null);
  const [amount, setAmount] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [accrued, setAccrued] = useState(0);
  const [log, setLog] = useState([]);
  const timerRef = useRef(null);

  const appendLog = (txt) => setLog((l) => [...l, `• ${txt}`]);

  const buyAndStream = () => {
    const amt = parseFloat(amount);
    if (!asset || !amt || streaming || amt > wallet) return;
    setWallet((w) => w - amt);
    setStreaming(true);
    appendLog(`🔄 Bought ${amt} ${asset.name} tokens · simulated ${asset.apr}% APR`);
  };
  const stopStream = () => {
    clearInterval(timerRef.current);
    setStreaming(false);
    appendLog('⏸️ Stream paused (demo control)');
  };

  const resetAll = () => {
    stopStream();
    setWallet(1000);
    setAsset(null);
    setAmount('');
    setAccrued(0);
    setLog([]);
  };

  useEffect(() => {
    if (!streaming) return;
    timerRef.current = setInterval(() => {
      const amt = parseFloat(amount);
      if (isNaN(amt)) return;
      const yieldPerTick = (amt * asset.apr) / 100 / TICKS_IN_YEAR;
      setAccrued((p) => p + yieldPerTick);
    }, TICK_MS);
    return () => clearInterval(timerRef.current);
  }, [streaming, asset, amount]);

  const claimYield = () => {
    setWallet((w) => w + accrued);
    appendLog(`✅ Claimed ${formatNum(accrued)} RUSD (via claimDividend() demo)`);
    setAccrued(0);
  };

  const formatNum = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const isReady = asset && parseFloat(amount) > 0 && parseFloat(amount) <= wallet;

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 bg-gradient-to-br from-emerald-50 to-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Yield Streamer</h1>
      <p className="text-[13px] text-gray-600 max-w-md text-center">
        This is a <span className="font-medium">simulation</span>. Real Novastro DTCs stream income according to each asset&apos;s actual
        rent or coupon schedule; here we compress one virtual year into one real minute for instant feedback.
      </p>

      <div className="bg-white px-6 py-2 rounded-full shadow flex items-center gap-2">
        <span className="text-sm text-gray-600">Wallet:</span>
        <span className="font-semibold text-gray-800">{formatNum(wallet)} RUSD</span>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ASSETS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAsset(a)}
            className={`flex flex-col items-center gap-1 bg-white p-5 rounded-xl shadow transition-transform hover:-translate-y-1 hover:cursor-pointer ${
              asset?.id === a.id ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <span className="text-4xl">{a.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{a.name}</span>
            <span className="text-xs text-gray-500">APR {a.apr}% (sim)</span>
          </button>
        ))}
      </section>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <input
          type="number"
          placeholder="Tokens to buy"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 border rounded-md w-40 text-sm shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          onClick={buyAndStream}
          disabled={!isReady}
          className="px-6 py-2 bg-emerald-600 text-white hover:cursor-pointer rounded-full shadow disabled:opacity-40"
        >
          Buy & Stream
        </button>
        {streaming && (
          <button onClick={stopStream} className="px-3 py-2 bg-gray-400 text-white hover:cursor-pointer rounded-full">
            ▌▌
          </button>
        )}
      </div>

      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg text-center space-y-2">
        <p className="text-gray-700">Accrued Yield</p>
        <p className="text-3xl font-semibold text-emerald-600">
          {formatNum(accrued)} RUSD
        </p>
        <button
          onClick={claimYield}
          disabled={accrued === 0}
          className="mt-2 px-5 py-2 bg-sky-600 text-white hover:cursor-pointer rounded-full disabled:opacity-40"
        >
          Claim Yield
        </button>
      </div>

      <details className="w-full max-w-md open:shadow-lg open:ring-2 open:ring-emerald-400 rounded-lg">
        <summary className="cursor-pointer bg-white px-4 py-2 font-medium select-none rounded-lg">
          Activity Log
        </summary>
        <pre className="whitespace-pre-wrap text-sm px-4 py-3">{log.join('\n') || 'No activity yet.'}</pre>
      </details>

      <button
        onClick={resetAll}
        disabled={!isReady}
        className="px-6 py-2 bg-gray-900 hover:cursor-pointer hover:bg-black text-white rounded-full shadow disabled:opacity-40"
      >
        Reset Demo
      </button>
    </main>
  );
}
