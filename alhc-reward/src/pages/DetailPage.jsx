import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

export default function DetailPage() {
  const { phone, user, loadUser, requestPurchase, redeem } = useUser();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const handleRequestPurchase = async () => {
    if (!user) return;
    await requestPurchase();
  };

  const handleRedeem = async () => {
    if (!user || user?.points < 5) return;
    await redeem(user?.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">☕</div>
          <h1 className="text-xl font-bold text-gray-800">Your Coffee Card</h1>
          <p className="text-sm text-gray-500">{phone}</p>
        </div>
        {
          
          ( <><div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Your Points</p>
            <p className="text-2xl font-bold text-amber-600">{user?.points}</p>
          </div><div className="text-center space-y-2">
              {Array.from({ length: Math.ceil(user?.purchases / 5) }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                  {Array.from({ length: 5 }, (_, iconIndex) => rowIndex * 5 + iconIndex)
                    .filter((index) => index < user?.purchases)
                    .map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition bg-green-500 text-white"
                      >
                        ☕
                      </div>
                    ))}
                </div>
              ))}
            </div><button
              onClick={handleRequestPurchase}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              I’ve bought coffee
            </button><button
              onClick={handleRedeem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              disabled={user?.points === 0}
            >
              Redeem Reward
            </button></>)
        }

      </div>
    </div>
  );
}