import React, { useState } from "react";

export default function TalerRechner() {
  const [talerPrice, setTalerPrice] = useState(120000);
  const [editingTaler, setEditingTaler] = useState(false);

  const [items, setItems] = useState({
    Komfort: [
      { id: 1, name: "Goldener Kartenhalter", talerCost: 100, resaleGold: 11990000, buyAmount: 1, sellAmount: 1 },
      { id: 5, name: "NosHändlerMedaille", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 6, name: "Haustierperle", talerCost: 100, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 7, name: "Partnerspezialistenkartenhalter", talerCost: 100, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 8, name: "Partnerperle", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 9, name: "Feenperle", talerCost: 100, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 10, name: "Parfüm (20 Stück)", talerCost: 25, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 11, name: "Lautsprecher (10 Stück)", talerCost: 5, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 12, name: "Hochzeitsbox", talerCost: 25, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 13, name: "Sprechblase (10 Stück)", talerCost: 5, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 14, name: "Flügel der Freundschaft (10 Stück)", talerCost: 5, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
    ],
    Verstärkung: [
      { id: 2, name: "Verstärkungsstein A", talerCost: 50, resaleGold: 5900000, buyAmount: 1, sellAmount: 1 },
    ],
    Begleiter: [
      { id: 3, name: "Begleiter-Futterpaket", talerCost: 20, resaleGold: 1800000, buyAmount: 1, sellAmount: 1 },
    ],
    Aussehen: [
      { id: 4, name: "Stylisches Kostüm", talerCost: 80, resaleGold: 9500000, buyAmount: 1, sellAmount: 1 },
    ],
    Versteckung: [
      { id: 15, name: "Cellon-Entferner", talerCost: 75, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 16, name: "Tattoo-Wechsel-Schriftrolle (zufällig)", talerCost: 60, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 17, name: "Loa-Wechsel-Kristall", talerCost: 60, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 18, name: "Premium-Runen-Upgraderolle", talerCost: 30, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 19, name: "Amulett des Segens", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 20, name: "Goldene Ausrüstungsschutzrolle", talerCost: 25, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 21, name: "Ausrüstungsschutzrolle", talerCost: 20, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 22, name: "Amulett des Schutzes", talerCost: 25, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 23, name: "Tarotkartenspiel", talerCost: 10, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 24, name: "Schriftrolle der Freisetzung", talerCost: 10, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 25, name: "Amulett der Verstärkung", talerCost: 5, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 26, name: "Heldenhaftes Amulett des Segens (Statisch)", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 27, name: "Heldenhaftes Amulett des Segens (Zufall)", talerCost: 75, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 28, name: "Reparatur-Runenamboss", talerCost: 10, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 29, name: "Runenentfernungs-Hammer", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 30, name: "Glücksrunen-Schriftrolle", talerCost: 25, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 31, name: "Tattoo-Speicherschriftrolle", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 32, name: "Tattoo-Entferner", talerCost: 35, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
      { id: 33, name: "Runenpolitur", talerCost: 60, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
    ],
  });

  function updateItem(category, id, patch) {
    setItems({
      ...items,
      [category]: items[category].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }

  function calcCostInGold(talerCost, amount) {
    return talerCost * talerPrice * amount;
  }

  function profitFor(item) {
    const cost = calcCostInGold(item.talerCost, item.buyAmount);
    const revenue = item.resaleGold * item.sellAmount;
    const profit = revenue - cost;
    const pct = cost === 0 ? 0 : (profit / cost) * 100;
    return { cost, profit, pct, revenue };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-yellow-400">Gold ↔ Taler Rechner</h1>
            <p className="text-sm text-gray-400">Berechne Gewinn & Verlust für Mall-Items — mit Mengenangabe.</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 shadow rounded p-4 flex flex-col sm:flex-row items-center gap-4">
            <div>
              <div className="text-xs text-gray-400">Talerpreis (1 Taler =)</div>
              {!editingTaler ? (
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-semibold text-orange-400">{talerPrice.toLocaleString('de-DE')}</div>
                  <div className="text-sm text-gray-500">Gold</div>
                </div>
              ) : (
                <input
                  type="number"
                  value={talerPrice}
                  onChange={(e) => setTalerPrice(Number(e.target.value))}
                  className="w-32 border border-gray-600 bg-gray-900 text-yellow-300 rounded px-2 py-1"
                />
              )}
            </div>
            <button
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded text-sm hover:opacity-90 transition"
              onClick={() => setEditingTaler((s) => !s)}
            >
              {editingTaler ? "Speichern" : "Bearbeiten"}
            </button>
          </div>
        </header>

        {Object.entries(items).map(([category, list]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-orange-400 border-b border-gray-700 pb-2 mb-4">{category}</h2>

            <div className="bg-gray-800 border border-gray-700 shadow-lg rounded p-4">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-700 uppercase">
                    <th className="p-2">Item</th>
                    <th className="p-2">Menge Einkauf</th>
                    <th className="p-2">Menge Verkauf</th>
                    <th className="p-2">Kosten (Taler)</th>
                    <th className="p-2">Einkauf (Gold)</th>
                    <th className="p-2">Wiederverkauf (Gold)</th>
                    <th className="p-2">Gewinn / Verlust</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((it) => {
                    const { cost, profit, pct, revenue } = profitFor(it);
                    return (
                      <tr key={it.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                        <td className="p-2 align-top w-48">
                          <input
                            className="w-full bg-transparent outline-none text-yellow-300"
                            value={it.name}
                            onChange={(e) => updateItem(category, it.id, { name: e.target.value })}
                          />
                        </td>
                        <td className="p-2 align-top w-24">
                          <input
                            type="number"
                            min={1}
                            value={it.buyAmount}
                            onChange={(e) => updateItem(category, it.id, { buyAmount: Number(e.target.value) })}
                            className="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="p-2 align-top w-24">
                          <input
                            type="number"
                            min={1}
                            value={it.sellAmount}
                            onChange={(e) => updateItem(category, it.id, { sellAmount: Number(e.target.value) })}
                            className="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="p-2 align-top w-24">
                          <input
                            type="number"
                            min={0}
                            value={it.talerCost}
                            onChange={(e) => updateItem(category, it.id, { talerCost: Number(e.target.value) })}
                            className="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="p-2 align-top text-yellow-400">{cost.toLocaleString('de-DE')}</td>
                        <td className="p-2 align-top">
                          <input
                            type="text"
                            value={Number(it.resaleGold).toLocaleString('de-DE')}
                            onChange={(e) => {
                              const val = Number(e.target.value.replace(/\./g, '').replace(/,/g, '.'));
                              if (!isNaN(val)) updateItem(category, it.id, { resaleGold: val });
                            }}
                            className="w-full border border-gray-600 bg-gray-900 text-right text-yellow-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className={`p-2 align-top font-semibold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit.toLocaleString('de-DE')} ({pct.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <footer className="mt-6 text-sm text-gray-500 text-center">
          <p>
            Hinweis: Diese App rechnet direkt mit den eingegebenen Zahlen. Behalte Transaktionskosten
            / Gebühren im Kopf – sie werden hier nicht automatisch berücksichtigt.
          </p>
        </footer>
      </div>
    </div>
  );
}
