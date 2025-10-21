import React, { useState } from "react";

export default function TalerRechner() {
  const [talerPrice, setTalerPrice] = useState(120000);
  const [editingTaler, setEditingTaler] = useState(false);

  const [items, setItems] = useState({
    Komfort: [
      { id: 1, name: "Goldener Kartenhalter", talerCost: 100, resaleGold: 11990000, buyAmount: 1, sellAmount: 1 }
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

  // Create elements without JSX
  return React.createElement(
    "div",
    { style: { padding: "20px", fontFamily: "Arial" } },
    [
      React.createElement("h1", { key: "title" }, "Gold Taler Rechner"),
      React.createElement("p", { key: "subtitle" }, "Berechne Gewinn und Verlust"),
      
      React.createElement(
        "div",
        { key: "price-section", style: { marginBottom: "20px" } },
        [
          React.createElement("div", { key: "label" }, "Talerpreis (1 Taler =)"),
          !editingTaler 
            ? React.createElement(
                "div", 
                { 
                  key: "display",
                  style: { display: "flex", gap: "10px", alignItems: "center" }
                },
                [
                  React.createElement(
                    "div",
                    { 
                      key: "value",
                      style: { fontSize: "20px", fontWeight: "bold" }
                    },
                    talerPrice.toLocaleString('de-DE')
                  ),
                  React.createElement("div", { key: "unit" }, "Gold")
                ]
              )
            : React.createElement("input", {
                key: "input",
                type: "number",
                value: talerPrice,
                onChange: (e) => setTalerPrice(Number(e.target.value)),
                style: { padding: "5px" }
              }),
          React.createElement(
            "button",
            {
              key: "button",
              onClick: () => setEditingTaler((s) => !s),
              style: { marginLeft: "10px", padding: "5px 10px" }
            },
            editingTaler ? "Speichern" : "Bearbeiten"
          )
        ]
      ),

      ...Object.entries(items).map(([category, list]) =>
        React.createElement(
          "div",
          {
            key: category,
            style: { marginBottom: "30px" }
          },
          [
            React.createElement("h2", { key: "header" }, category),
            React.createElement(
              "div",
              {
                key: "table-container",
                style: { overflowX: "auto" }
              },
              React.createElement(
                "table",
                {
                  key: "table",
                  style: { width: "100%", borderCollapse: "collapse" }
                },
                [
                  React.createElement(
                    "thead",
                    { key: "thead" },
                    React.createElement(
                      "tr",
                      { key: "header-row" },
                      [
                        React.createElement("th", { key: "name", style: tableHeaderStyle }, "Item"),
                        React.createElement("th", { key: "amount", style: tableHeaderStyle }, "Menge"),
                        React.createElement("th", { key: "cost", style: tableHeaderStyle }, "Kosten (Taler)"),
                        React.createElement("th", { key: "buy", style: tableHeaderStyle }, "Einkauf (Gold)"),
                        React.createElement("th", { key: "sell", style: tableHeaderStyle }, "Verkauf (Gold)"),
                        React.createElement("th", { key: "profit", style: tableHeaderStyle }, "Gewinn/Verlust")
                      ]
                    )
                  ),
                  React.createElement(
                    "tbody",
                    { key: "tbody" },
                    list.map((it) => {
                      const { cost, profit, pct } = profitFor(it);
                      return React.createElement(
                        "tr",
                        { key: it.id },
                        [
                          React.createElement(
                            "td",
                            { key: "name", style: tableCellStyle },
                            React.createElement("input", {
                              value: it.name,
                              onChange: (e) => updateItem(category, it.id, { name: e.target.value }),
                              style: { width: "100%", padding: "4px" }
                            })
                          ),
                          React.createElement(
                            "td",
                            { key: "amount", style: tableCellStyle },
                            React.createElement("input", {
                              type: "number",
                              value: it.buyAmount,
                              onChange: (e) => updateItem(category, it.id, { buyAmount: Number(e.target.value) }),
                              style: { width: "60px", padding: "4px" }
                            })
                          ),
                          React.createElement(
                            "td",
                            { key: "cost", style: tableCellStyle },
                            React.createElement("input", {
                              type: "number",
                              value: it.talerCost,
                              onChange: (e) => updateItem(category, it.id, { talerCost: Number(e.target.value) }),
                              style: { width: "60px", padding: "4px" }
                            })
                          ),
                          React.createElement(
                            "td",
                            { key: "buy", style: tableCellStyle },
                            cost.toLocaleString('de-DE')
                          ),
                          React.createElement(
                            "td",
                            { key: "sell", style: tableCellStyle },
                            React.createElement("input", {
                              type: "number",
                              value: it.resaleGold,
                              onChange: (e) => updateItem(category, it.id, { resaleGold: Number(e.target.value) }),
                              style: { width: "120px", padding: "4px" }
                            })
                          ),
                          React.createElement(
                            "td",
                            {
                              key: "profit",
                              style: {
                                ...tableCellStyle,
                                color: profit >= 0 ? "green" : "red",
                                fontWeight: "bold"
                              }
                            },
                            `${profit.toLocaleString('de-DE')} (${pct.toFixed(2)}%)`
                          )
                        ]
                      );
                    })
                  )
                ]
              )
            )
          ]
        )
      ),

      React.createElement(
        "footer",
        {
          key: "footer",
          style: { marginTop: "20px", fontSize: "12px", color: "#666" }
        },
        React.createElement("p", { key: "footer-text" }, "Hinweis: Transaktionskosten nicht beruecksichtigt.")
      )
    ]
  );
}

// Style definitions
const tableHeaderStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  textAlign: "left"
};

const tableCellStyle = {
  padding: "8px",
  border: "1px solid #ccc"
};
