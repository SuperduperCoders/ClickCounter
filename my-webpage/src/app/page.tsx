'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [hasPurchased2x, setHasPurchased2x] = useState(false);
  const [hasPurchased5x, setHasPurchased5x] = useState(false);
  const [hasPurchased10x, setHasPurchased10x] = useState(false);
  const [hasPurchased20x, setHasPurchased20x] = useState(false);
  const [hasAutoClicker, setHasAutoClicker] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [clickAnimating, setClickAnimating] = useState(false);
  const [purchasedUpgrade, setPurchasedUpgrade] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('clicker-data');
    if (saved) {
      const data = JSON.parse(saved);
      setCount(data.count || 0);
      setMultiplier(data.multiplier || 1);
      setHasPurchased2x(data.hasPurchased2x || false);
      setHasPurchased5x(data.hasPurchased5x || false);
      setHasPurchased10x(data.hasPurchased10x || false);
      setHasPurchased20x(data.hasPurchased20x || false);
      setHasAutoClicker(data.hasAutoClicker || false);
    } else {
      setShowTutorial(true);
    }

    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const saveData = {
      count,
      multiplier,
      hasPurchased2x,
      hasPurchased5x,
      hasPurchased10x,
      hasPurchased20x,
      hasAutoClicker,
    };
    localStorage.setItem('clicker-data', JSON.stringify(saveData));
  }, [count, multiplier, hasPurchased2x, hasPurchased5x, hasPurchased10x, hasPurchased20x, hasAutoClicker]);

  useEffect(() => {
    if (hasAutoClicker) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 10);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasAutoClicker]);

  const handleClick = () => {
    setCount(count + multiplier);
    setClickAnimating(true);
    setTimeout(() => setClickAnimating(false), 200);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
    } else {
      localStorage.removeItem('clicker-data');
      window.location.reload();
    }
  };

  const triggerUpgradeAnimation = (name: string) => {
    setPurchasedUpgrade(name);
    setTimeout(() => setPurchasedUpgrade(''), 500);
  };

  const purchase2x = () => {
    if (count >= 300 && !hasPurchased2x) {
      setCount(count - 300);
      setMultiplier(2);
      setHasPurchased2x(true);
      triggerUpgradeAnimation('2x');
    }
  };

  const purchase5x = () => {
    if (count >= 1000 && !hasPurchased5x) {
      setCount(count - 1000);
      setMultiplier(5);
      setHasPurchased5x(true);
      triggerUpgradeAnimation('5x');
    }
  };

  const purchase10x = () => {
    if (count >= 5000 && !hasPurchased10x) {
      setCount(count - 5000);
      setMultiplier(10);
      setHasPurchased10x(true);
      triggerUpgradeAnimation('10x');
    }
  };

  const purchase20x = () => {
    if (count >= 10000 && !hasPurchased20x) {
      setCount(count - 10000);
      setMultiplier(20);
      setHasPurchased20x(true);
      triggerUpgradeAnimation('20x');
    }
  };

  const purchaseAutoClicker = () => {
    if (count >= 50 && !hasAutoClicker) {
      setCount(count - 50);
      setHasAutoClicker(true);
      triggerUpgradeAnimation('AutoClicker');
    }
  };

  const closeTutorial = () => setShowTutorial(false);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-50 text-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-semibold text-blue-700">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-50 text-center p-4 relative overflow-hidden">
      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        {confirmReset ? 'Are you sure? Click again!' : 'Restart'}
      </button>

      {/* Tutorial */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-blue-600">🚀 Welcome to Clicker Game!</h2>
            <p className="text-gray-700">Click the big button to earn points.</p>
            <p className="text-gray-700">Use your points to buy upgrades and get stronger!</p>
            <p className="text-gray-700">You can even unlock an Auto-Clicker!</p>
            <button
              onClick={closeTutorial}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >
              Let's Go!
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Notice */}
      {purchasedUpgrade && (
        <div className="absolute top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg animate-bounce z-20">
          {purchasedUpgrade} Upgrade Purchased!
        </div>
      )}

      <div className="flex gap-8 items-start mt-8">
        {/* Main Counter */}
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-4xl text-blue-500 font-extrabold mb-4">Click Counter</h1>
          <p className="text-lg mb-4 text-gray-700">
            You clicked <span className="font-bold">{count}</span> times
          </p>

          <button
            onClick={handleClick}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl transition mb-6 text-xl ${
              clickAnimating ? 'scale-110' : ''
            }`}
            style={{
              transform: clickAnimating ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}
          >
            Click Me (+{multiplier})
          </button>

          <div className="space-y-3">
            {count >= 200 && !hasPurchased2x && (
              <button onClick={purchase2x} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full">
                Purchase 2x Clicks (300 clicks)
              </button>
            )}
            {count >= 700 && !hasPurchased5x && (
              <button onClick={purchase5x} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg w-full">
                Purchase 5x Clicks (1000 clicks)
              </button>
            )}
            {count >= 4000 && !hasPurchased10x && (
              <button onClick={purchase10x} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg w-full">
                Purchase 10x Clicks (5000 clicks)
              </button>
            )}
            {count >= 8000 && !hasPurchased20x && (
              <button onClick={purchase20x} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg w-full">
                Purchase 20x Clicks (10000 clicks)
              </button>
            )}
          </div>
        </div>

        {/* Auto Clicker + Team Box */}
        <div className="bg-white p-4 rounded-2xl shadow-lg w-40 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Your Team</h2>
          <div className="flex flex-col items-center space-y-2 mb-4">
            {hasPurchased5x && <img src="https://tse4.mm.bing.net/th?id=OIP.zL9EDrARIn7rOta0q8dOswHaHa&pid=Api&P=0&h=220" alt="Stickman" className="w-10" />}
            {hasPurchased10x && <img src="https://tse4.mm.bing.net/th?id=OIP.zL9EDrARIn7rOta0q8dOswHaHa&pid=Api&P=0&h=220" alt="Stickman" className="w-10" />}
            {hasPurchased20x && <img src="https://tse4.mm.bing.net/th?id=OIP.zL9EDrARIn7rOta0q8dOswHaHa&pid=Api&P=0&h=220" alt="Stickman" className="w-10" />}
          </div>

          {!hasAutoClicker && count >= 30 && (
            <button onClick={purchaseAutoClicker} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
              Buy 10 Clicks/sec (50 clicks)
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
