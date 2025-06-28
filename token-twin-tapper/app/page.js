'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const ASSETS = [
    { id: 'office', name: 'Office Tower', emoji: '🏢', cost: 400 },
    { id: 'solar', name: 'Solar Farm', emoji: '🔆', cost: 300 },
    { id: 'invoice', name: 'Invoice Pool', emoji: '📄', cost: 150 },
    { id: 'gold', name: 'Gold Bullion', emoji: '🥇', cost: 250 }
  ];
  const CHAINS = [
    { id: 'arbitrum', name: 'Arbitrum', emoji: '🛡️' },
    { id: 'solana', name: 'Solana', emoji: '🌊' },
    { id: 'sui', name: 'Sui', emoji: '💧' },
    { id: 'base', name: 'Base', emoji: '🚀' }
  ];
  const STAGES = ['Select Asset', 'Mint DTC', 'Enable Compliance', 'Bridge'];

  const [balance, setBalance] = useState(1000); // starting RUSD
  const [stageIdx, setStageIdx] = useState(0);
  const [asset, setAsset] = useState(null);
  const [chain, setChain] = useState(null);
  const [log, setLog] = useState([]);
  const [yieldEarned, setYieldEarned] = useState(0);
  const addLog = (line) => setLog((prev) => [...prev, `• ${line}`]);

  useEffect(() => {
    if (stageIdx === 4) {
      import('canvas-confetti').then(({ default: confetti }) => confetti({ particleCount: 90, spread: 70 }));
    }
  }, [stageIdx]);

  const reset = () => {
    setStageIdx(0);
    setAsset(null);
    setChain(null);
    setYieldEarned(0);
    setLog([]);
  };

  const chooseAsset = (a) => {
    if (stageIdx !== 0 || balance < a.cost) return;
    setAsset(a);
    setBalance((b) => b - a.cost);
    addLog(`Bought ${a.name} for ${a.cost} RUSD`);
    setStageIdx(1);
    addLog('✔️ DTC minted (0.2 $NOVAS fee)');
  };

  const enableCompliance = () => {
    if (stageIdx !== 2) return;
    addLog('✔️ KYC & jurisdiction locked');
    setStageIdx(3);
  };

  const bridgeTo = (c) => {
    if (stageIdx !== 3) return;
    setChain(c);
    addLog(`🌉 Bridged to ${c.name}`);

    // simulate a 12% yield
    const earned = Math.round(asset.cost * 0.12);
    setYieldEarned(earned);
    setBalance((b) => b + earned);
    addLog(`💸 Rental yield streamed: +${earned} RUSD`);

    setStageIdx(4);
  };

  const StageCircle = ({ idx, label }) => (
    <div className="flex flex-col items-center text-xs">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          stageIdx >= idx ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}
      >
        {idx + 1}
      </div>
      <span className="mt-1 w-24 text-center leading-tight">{label}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Token Twin Tapper</h1>

      {/* balance */}
      <div className="mb-8 text-lg font-semibold bg-white px-6 py-2 rounded-full shadow">
        Balance: {balance} RUSD
      </div>

      {/* progress stepper */}
      <div className="flex gap-6 mb-10">
        {STAGES.map((s, i) => (
          <StageCircle key={s} idx={i} label={s} />
        ))}
      </div>

      {/* asset selection */}
      {stageIdx === 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {ASSETS.map((a) => (
            <button
              key={a.id}
              onClick={() => chooseAsset(a)}
              disabled={balance < a.cost}
              className={`flex flex-col items-center gap-1 bg-white p-5 rounded-xl shadow transition-transform hover:-translate-y-1 disabled:opacity-40 ${
                balance < a.cost ? '' : 'hover:shadow-lg'
              }`}
            >
              <span className="text-4xl">{a.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{a.name}</span>
              <span className="text-xs text-gray-500">Cost: {a.cost} RUSD</span>
            </button>
          ))}
        </section>
      )}

      {/* mint confirmation */}
      {stageIdx === 1 && (
        <div className="mb-10 text-center">
          <p className="mb-4 text-lg">
            ✅ DTC minted for <strong>{asset.name}</strong>
          </p>
          <button
            onClick={() => setStageIdx(2)}
            className="px-6 py-3 bg-emerald-500 text-white rounded-full shadow-md hover:bg-emerald-600"
          >
            Next: Set Compliance
          </button>
        </div>
      )}

      {/* compliance toggle */}
      {stageIdx === 2 && (
        <div className="mb-10 flex flex-col items-center gap-4">
          <p className="text-gray-700">Enable KYC & jurisdiction rules for the token.</p>
          <button
            onClick={enableCompliance}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
          >
            Enable Compliance
          </button>
        </div>
      )}

      {/* bridge selection */}
      {stageIdx === 3 && (
        <section className="flex flex-wrap justify-center gap-4 mb-10">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              onClick={() => bridgeTo(c)}
              className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow hover:shadow-lg"
            >
              <span className="text-lg">{c.emoji}</span>
              <span className="text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </section>
      )}

      {/* success summary */}
      {stageIdx === 4 && (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center mb-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">🎉 Token Live!</h2>
          <p className="mb-1">
            <strong>{asset.name}</strong> now trades on <strong>{chain.name}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-3">Compliance enforced · Fees paid in $NOVAS</p>
          <p className="mb-1 text-green-600 font-medium">Yield earned: +{yieldEarned} RUSD</p>
          <button
            onClick={reset}
            className="mt-3 px-6 py-2 bg-emerald-500 text-white rounded-full shadow hover:bg-emerald-600"
          >
            Start New Trade
          </button>
        </div>
      )}

      {/* activity log */}
      <details className="w-full max-w-md mb-10 open:shadow-lg open:ring-2 open:ring-emerald-400 rounded-lg">
        <summary className="cursor-pointer bg-white px-4 py-2 font-medium select-none rounded-lg">
          Activity Log
        </summary>
        <pre className="whitespace-pre-wrap text-sm px-4 py-3">{log.join('\n') || 'No actions yet.'}</pre>
      </details>
    </main>
  );
}
