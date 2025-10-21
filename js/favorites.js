// Favoriten-Management
const favorites = {
    init() {
        this.updateDisplay();
    },
    
    updateDisplay() {
        const favoritesSection = document.getElementById('favorites-section');
        const favoritesTbody = document.getElementById('favorites-tbody');
        const noFavorites = document.getElementById('no-favorites');
        const favoritesCount = document.getElementById('favorites-count');
        
        const allFavorites = this.getAllFavorites();
        
        if (allFavorites.length > 0) {
            favoritesSection.classList.remove('hidden');
            noFavorites.classList.add('hidden');
            favoritesCount.textContent = `(${allFavorites.length})`;
            
            this.renderFavorites(allFavorites, favoritesTbody);
        } else {
            favoritesSection.classList.add('hidden');
            noFavorites.classList.remove('hidden');
            favoritesCount.textContent = '';
        }
    },
    
    getAllFavorites() {
        const favorites = [];
        
        // Taler Items Favoriten
        for (const [category, items] of Object.entries(talerCalculator.data)) {
            for (const item of items) {
                if (item.isFavorite) {
                    favorites.push({...item, category, isTalerItem: true});
                }
            }
        }
        
        // Items Umrechner Favoriten
        for (const [category, items] of Object.entries(itemsCalculator.data)) {
            for (const item of items) {
                if (item.isFavorite) {
                    favorites.push({...item, category, isTalerItem: false});
                }
            }
        }
        
        return favorites;
    },
    
    renderFavorites(favorites, container) {
        container.innerHTML = '';
        
        favorites.forEach(item => {
            const { cost, profit, pct, revenue } = item.isTalerItem ? 
                talerCalculator.profitFor(item) : 
                itemsCalculator.profitForItem(item);
            
            const typeLabel = item.isTalerItem ? 'Taler' : 'Item';
            
            const row = document.createElement('tr');
            row.id = `favorite-${item.isTalerItem ? 'taler' : 'item'}-${item.category}-${item.id}`;
            row.className = 'border-b border-gray-700 hover:bg-gray-700/40';
            
            // Unterschiedliche Tabellenstruktur für Taler vs. Items
            if (item.isTalerItem) {
                row.innerHTML = this.getTalerFavoriteRow(item, cost, profit, pct, revenue, typeLabel);
            } else {
                row.innerHTML = this.getItemFavoriteRow(item, cost, profit, pct, revenue, typeLabel);
            }
            
            container.appendChild(row);
            this.attachFavoriteEventListeners(row, item);
        });
    },
    
    getTalerFavoriteRow(item, cost, profit, pct, revenue, typeLabel) {
        return `
            <td class="p-2 align-top">
                <span class="favorite-star favorited" onclick="talerCalculator.toggleFavorite('${item.category}', ${item.id})">★</span>
            </td>
            <td class="p-2 align-top">
                <div class="text-yellow-300">${talerCalculator.highlightText(item.name, app.searchTerm)}</div>
                <div class="text-xs text-gray-500">${item.category} (${typeLabel})</div>
            </td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="1"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 buy-amount"
                    value="${item.buyAmount}"
                />
            </td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="0"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 taler-cost"
                    value="${item.talerCost}"
                />
            </td>
            <td class="p-2 align-top text-yellow-400 cost-cell">${app.formatNumber(cost)}</td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="1"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 sell-amount"
                    value="${item.sellAmount}"
                />
            </td>
            <td class="p-2 align-top">
                <input
                    type="text"
                    class="w-full border border-gray-600 bg-gray-900 text-right text-yellow-300 rounded px-2 py-1 resale-gold"
                    value="${app.formatNumber(item.resaleGold)}"
                />
            </td>
            <td class="p-2 align-top font-semibold ${item.resaleGold > 0 ? (profit >= 0 ? 'profit-positive' : 'profit-negative') : 'text-gray-500'} profit-cell">
                ${item.resaleGold > 0 ? `${app.formatNumber(profit)} (${pct.toFixed(2)}%)` : '-'}
            </td>
            <td class="p-2 align-top">
                <button onclick="${item.isTalerItem ? 'talerCalculator' : 'itemsCalculator'}.deleteItem('${item.category}', ${item.id})" class="text-red-400 hover:text-red-300 transition">
                    🗑️
                </button>
            </td>
        `;
    },
    
    getItemFavoriteRow(item, cost, profit, pct, revenue, typeLabel) {
        return `
            <td class="p-2 align-top">
                <span class="favorite-star favorited" onclick="itemsCalculator.toggleFavorite('${item.category}', ${item.id})">★</span>
            </td>
            <td class="p-2 align-top">
                <div class="text-yellow-300">${itemsCalculator.highlightText(item.name, app.searchTerm)}</div>
                <div class="text-xs text-gray-500">${item.category} (${typeLabel})</div>
            </td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="1"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 amount"
                    value="${item.amount}"
                />
            </td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="0"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 buy-price"
                    value="${item.buyPrice}"
                />
            </td>
            <td class="p-2 align-top text-yellow-400 cost-cell">${app.formatNumber(cost)}</td>
            <td class="p-2 align-top">
                <input
                    type="number"
                    min="1"
                    class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 amount"
                    value="${item.amount}"
                    disabled
                />
            </td>
            <td class="p-2 align-top">
                <input
                    type="text"
                    class="w-full border border-gray-600 bg-gray-900 text-right text-yellow-300 rounded px-2 py-1 sell-price"
                    value="${app.formatNumber(item.sellPrice)}"
                />
            </td>
            <td class="p-2 align-top font-semibold ${item.sellPrice > 0 ? (profit >= 0 ? 'profit-positive' : 'profit-negative') : 'text-gray-500'} profit-cell">
                ${item.sellPrice > 0 ? `${app.formatNumber(profit)} (${pct.toFixed(2)}%)` : '-'}
            </td>
            <td class="p-2 align-top">
                <button onclick="itemsCalculator.deleteItem('${item.category}', ${item.id})" class="text-red-400 hover:text-red-300 transition">
                    🗑️
                </button>
            </td>
        `;
    },
    
    attachFavoriteEventListeners(row, item) {
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const fieldMap = {
                    'buy-amount': 'buyAmount',
                    'taler-cost': 'talerCost',
                    'buy-price': 'buyPrice',
                    'sell-amount': 'sellAmount',
                    'resale-gold': 'resaleGold',
                    'sell-price': 'sellPrice',
                    'amount': 'amount'
                };
                
                const field = fieldMap[input.className.split(' ').find(cls => cls in fieldMap)];
                const value = input.type === 'text' ? app.parseNumber(e.target.value) : parseInt(e.target.value);
                
                if (!isNaN(value)) {
                    if (item.isTalerItem) {
                        talerCalculator.updateItem(item.category, item.id, field, value);
                    } else {
                        itemsCalculator.updateItem(item.category, item.id, field, value);
                    }
                }
            });
        });
    }
};