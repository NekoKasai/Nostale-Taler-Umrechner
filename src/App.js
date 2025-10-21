import React, { useState } from "react";

export default function TalerRechner() {
  const [talerPrice, setTalerPrice] = useState(120000);
  const [editingTaler, setEditingTaler] = useState(false);

  const [items, setItems] = useState({
    Komfort: [
      { id: 1, name: "Goldener Kartenhalter", talerCost: 100, resaleGold: 11990000, buyAmount: 1, sellAmount: 1 },
      { id: 5, name: "NosHändlerMedaille", talerCost: 50, resaleGold: 0, buyAmount: 1, sellAmount: 1 },
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1f2937, #111827, #000)',
      color: '#f3f4f6',
      padding: '1.5rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '800', 
              color: '#fbbf24',
              margin: 0
            }}>
              Gold ↔ Taler Rechner
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
              Berechne Gewinn & Verlust für Mall-Items
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            borderRadius: '0.375rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Talerpreis (1 Taler =)
              </div>
              {!editingTaler ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fb923c' }}>
                    {talerPrice.toLocaleString('de-DE')}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Gold</div>
                </div>
              ) : (
                <input
                  type="number"
                  value={talerPrice}
                  onChange={(e) => setTalerPrice(Number(e.target.value))}
                  style={{
                    width: '8rem',
                    border: '1px solid '#4b5563',
                    backgroundColor: '#111827',
                    color: '#fbbf24',
                    borderRadius: '0.25rem',
                    padding: '0.25rem 0.5rem'
                  }}
                />
              )}
            </div>
            <button
              style={{
                padding: '0.25rem 0.75rem',
                background: 'linear-gradient(to right, #f97316, #fbbf24)',
                color: 'black',
                fontWeight: '600',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
              onClick={() => setEditingTaler((s) => !s)}
            >
              {editingTaler ? "Speichern" : "Bearbeiten"}
            </button>
          </div>
        </header>

        {Object.entries(items).map(([category, list]) => (
          <section key={category} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#fb923c',
              borderBottom: '1px solid #374151',
              paddingBottom: '0.5rem',
              marginBottom: '1rem'
            }}>
              {category}
            </h2>

            <div style={{ 
              backgroundColor: '#374151',
              border: '1px solid '#4b5563',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    borderBottom: '1px solid '#4b5563',
                    textTransform: 'uppercase'
                  }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Menge Einkauf</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Menge Verkauf</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Kosten (Taler)</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Einkauf (Gold)</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Wiederverkauf (Gold)</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Gewinn / Verlust</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((it) => {
                    const { cost, profit, pct, revenue } = profitFor(it);
                    return (
                      <tr key={it.id} style={{ 
                        borderBottom: '1px solid '#4b5563'
                      }}>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            value={it.name}
                            onChange={(e) => updateItem(category, it.id, { name: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: '#fbbf24'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="number"
                            min={1}
                            value={it.buyAmount}
                            onChange={(e) => updateItem(category, it.id, { buyAmount: Number(e.target.value) })}
                            style={{
                              width: '5rem',
                              border: '1px solid '#4b5563',
                              backgroundColor: '#111827',
                              color: '#fb923c',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="number"
                            min={1}
                            value={it.sellAmount}
                            onChange={(e) => updateItem(category, it.id, { sellAmount: Number(e.target.value) })}
                            style={{
                              width: '5rem',
                              border: '1px solid '#4b5563',
                              backgroundColor: '#111827',
                              color: '#fb923c',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="number"
                            min={0}
                            value={it.talerCost}
                            onChange={(e) => updateItem(category, it.id, { talerCost: Number(e.target.value) })}
                            style={{
                              width: '5rem',
                              border: '1px solid '#4b5563',
                              backgroundColor: '#111827',
                              color: '#fb923c',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem', color: '#fbbf24' }}>
                          {cost.toLocaleString('de-DE')}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="text"
                            value={Number(it.resaleGold).toLocaleString('de-DE')}
                            onChange={(e) => {
                              const val = Number(e.target.value.replace(/\./g, '').replace(/,/g, '.'));
                              if (!isNaN(val)) updateItem(category, it.id, { resaleGold: val });
                            }}
                            style={{
                              width: '100%',
                              border: '1px solid '#4b5563',
                              backgroundColor: '#111827',
                              textAlign: 'right',
                              color: '#fbbf24',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          />
                        </td>
                        <td style={{ 
                          padding: '0.5rem',
                          fontWeight: '600',
                          color: profit >= 0 ? '#10b981' : '#ef4444'
                        }}>
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

        <footer style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
          <p>
            Hinweis: Diese App rechnet direkt mit den eingegebenen Zahlen. Behalte Transaktionskosten
            / Gebühren im Kopf – sie werden hier nicht automatisch berücksichtigt.
          </p>
        </footer>
      </div>
    </div>
  );
}
