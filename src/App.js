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

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937, #111827, #000)',
      color: '#f3f4f6',
      padding: '1.5rem',
      fontFamily: 'system-ui, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#fbbf24',
      margin: 0,
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      margin: 0,
      textAlign: 'center'
    },
    priceBox: {
      backgroundColor: '#374151',
      border: '1px solid #4b5563',
      borderRadius: '0.375rem',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    priceLabel: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    priceValue: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#fb923c'
    },
    priceUnit: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    editButton: {
      padding: '0.25rem 0.75rem',
      background: 'linear-gradient(to right, #f97316, #fbbf24)',
      color: 'black',
      fontWeight: '600',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    input: {
      width: '8rem',
      border: '1px solid #4b5563',
      backgroundColor: '#111827',
      color: '#fbbf24',
      borderRadius: '0.25rem',
      padding: '0.25rem 0.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fb923c',
      borderBottom: '1px solid #374151',
      paddingBottom: '0.5rem',
      marginBottom: '1rem'
    },
    tableContainer: {
      backgroundColor: '#374151',
      border: '1px solid #4b5563',
      borderRadius: '0.5rem',
      padding: '1rem',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px'
    },
    tableHeader: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      borderBottom: '1px solid #4b5563',
      textTransform: 'uppercase',
      textAlign: 'left',
      padding: '0.5rem'
    },
    tableCell: {
      padding: '0.5rem',
      borderBottom: '1px solid #4b5563'
    },
    itemInput: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fbbf24'
    },
    numberInput: {
      width: '5rem',
      border: '1px solid #4b5563',
      backgroundColor: '#111827',
      color: '#fb923c',
      borderRadius: '0.25rem',
      padding: '0.25rem 0.5rem'
    },
    costText: {
      color: '#fbbf24'
    },
    profitPositive: {
      color: '#10b981',
      fontWeight: '600'
    },
    profitNegative: {
      color: '#ef4444',
      fontWeight: '600'
    },
    footer: {
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Gold ↔ Taler Rechner</h1>
            <p style={styles.subtitle}>Berechne Gewinn & Verlust für Mall-Items — mit Mengenangabe.</p>
          </div>

          <div style={styles.priceBox}>
            <div>
              <div style={styles.priceLabel}>Talerpreis (1 Taler =)</div>
              {!editingTaler ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <div style={styles.priceValue}>{talerPrice.toLocaleString('de-DE')}</div>
                  <div style={styles.priceUnit}>Gold</div>
                </div>
              ) : (
                <input
                  type="number"
                  value={talerPrice}
                  onChange={(e) => setTalerPrice(Number(e.target.value))}
                  style={styles.input}
                />
              )}
            </div>
            <button
              style={styles.editButton}
              onClick={() => setEditingTaler((s) => !s)}
            >
              {editingTaler ? "Speichern" : "Bearbeiten"}
            </button>
          </div>
        </header>

        {Object.entries(items).map(([category, list]) => (
          <section key={category} style={{ marginBottom: '2.5rem' }}>
            <h2 style={styles.sectionTitle}>{category}</h2>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Item</th>
                    <th style={styles.tableHeader}>Menge Einkauf</th>
                    <th style={styles.tableHeader}>Menge Verkauf</th>
                    <th style={styles.tableHeader}>Kosten (Taler)</th>
                    <th style={styles.tableHeader}>Einkauf (Gold)</th>
                    <th style={styles.tableHeader}>Wiederverkauf (Gold)</th>
                    <th style={styles.tableHeader}>Gewinn / Verlust</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((it) => {
                    const { cost, profit, pct, revenue } = profitFor(it);
                    return (
                      <tr key={it.id} style={styles.tableCell}>
                        <td style={styles.tableCell}>
                          <input
                            value={it.name}
                            onChange={(e) => updateItem(category, it.id, { name: e.target.value })}
                            style={styles.itemInput}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            min={1}
                            value={it.buyAmount}
                            onChange={(e) => updateItem(category, it.id, { buyAmount: Number(e.target.value) })}
                            style={styles.numberInput}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            min={1}
                            value={it.sellAmount}
                            onChange={(e) => updateItem(category, it.id, { sellAmount: Number(e.target.value) })}
                            style={styles.numberInput}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="number"
                            min={0}
                            value={it.talerCost}
                            onChange={(e) => updateItem(category, it.id, { talerCost: Number(e.target.value) })}
                            style={styles.numberInput}
                          />
                        </td>
                        <td style={{...styles.tableCell, ...styles.costText}}>
                          {cost.toLocaleString('de-DE')}
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="text"
                            value={Number(it.resaleGold).toLocaleString('de-DE')}
                            onChange={(e) => {
                              const val = Number(e.target.value.replace(/\./g, '').replace(/,/g, '.'));
                              if (!isNaN(val)) updateItem(category, it.id, { resaleGold: val });
                            }}
                            style={{...styles.numberInput, width: '100%', textAlign: 'right'}}
                          />
                        </td>
                        <td style={{
                          ...styles.tableCell,
                          ...(profit >= 0 ? styles.profitPositive : styles.profitNegative)
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

        <footer style={styles.footer}>
          <p>
            Hinweis: Diese App rechnet direkt mit den eingegebenen Zahlen. Behalte Transaktionskosten
            / Gebühren im Kopf – sie werden hier nicht automatisch berücksichtigt.
          </p>
        </footer>
      </div>
    </div>
  );
}
