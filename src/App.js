import React, { useState } from "react";

export default function TalerRechner() {
  const [talerPrice, setTalerPrice] = useState(120000);
  const [editingTaler, setEditingTaler] = useState(false);

  const [items, setItems] = useState({
    Komfort: [
      { id: 1, name: "Goldener Kartenhalter", talerCost: 100, resaleGold: 11990000, buyAmount: 1, sellAmount: 1 }
    ],
    Verstaerkung: [
      { id: 2, name: "Verstaerkungsstein A", talerCost: 50, resaleGold: 5900000, buyAmount: 1, sellAmount: 1 }
    ]
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Gold Taler Rechner</h1>
      <p>Berechne Gewinn und Verlust fuer Mall-Items</p>
      
      <div style={{ marginBottom: "20px" }}>
        <div>Talerpreis (1 Taler =)</div>
        {!editingTaler ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {talerPrice.toLocaleString('de-DE')}
            </div>
            <div>Gold</div>
          </div>
        ) : (
          <input
            type="number"
            value={talerPrice}
            onChange={(e) => setTalerPrice(Number(e.target.value))}
            style={{ padding: "5px" }}
          />
        )}
        <button
          onClick={() => setEditingTaler((s) => !s)}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          {editingTaler ? "Speichern" : "Bearbeiten"}
        </button>
      </div>

      {Object.entries(items).map(([category, list]) => (
        <div key={category} style={{ marginBottom: "30px" }}>
          <h2>{category}</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Menge Einkauf</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Kosten (Taler)</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Einkauf (Gold)</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Wiederverkauf (Gold)</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Gewinn / Verlust</th>
                </tr>
              </thead>
              <tbody>
                {list.map((it) => {
                  const { cost, profit, pct } = profitFor(it);
                  return (
                    <tr key={it.id}>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <input
                          value={it.name}
                          onChange={(e) => updateItem(category, it.id, { name: e.target.value })}
                          style={{ width: "100%", padding: "4px" }}
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <input
                          type="number"
                          value={it.buyAmount}
                          onChange={(e) => updateItem(category, it.id, { buyAmount: Number(e.target.value) })}
                          style={{ width: "60px", padding: "4px" }}
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <input
                          type="number"
                          value={it.talerCost}
                          onChange={(e) => updateItem(category, it.id, { talerCost: Number(e.target.value) })}
                          style={{ width: "60px", padding: "4px" }}
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        {cost.toLocaleString('de-DE')}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <input
                          type="number"
                          value={it.resaleGold}
                          onChange={(e) => updateItem(category, it.id, { resaleGold: Number(e.target.value) })}
                          style={{ width: "120px", padding: "4px" }}
                        />
                      </td>
                      <td style={{ 
                        padding: "8px", 
                        border: "1px solid #ccc",
                        color: profit >= 0 ? "green" : "red",
                        fontWeight: "bold"
                      }}>
                        {profit.toLocaleString('de-DE')} ({pct.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <footer style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Hinweis: Transaktionskosten werden nicht beruecksichtigt.</p>
      </footer>
    </div>
  );
}
