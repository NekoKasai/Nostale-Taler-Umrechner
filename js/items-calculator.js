// Items-Umrechner Funktionalität
const itemsCalculator = {
    data: {},
    nextItemId: 2000,
    collapsedCategories: {},
    
    init(itemsData) {
        this.data = itemsData;
        this.loadCollapsedStates();
        this.renderAllCategories();
    },
    
    // Hilfsfunktionen
    profitForItem(item, sellAmount = null) {
        const actualSellAmount = sellAmount !== null ? sellAmount : item.amount;
        const cost = item.buyPrice * item.amount;
        const revenue = item.sellPrice * actualSellAmount;
        const profit = revenue - cost;
        const pct = cost === 0 ? 0 : (profit / cost) * 100;
        return { cost, profit, pct, revenue, sellAmount: actualSellAmount };
    },
    
    // Berechnet ab welcher Menge Gewinn gemacht wird
    calculateBreakEven(item) {
        if (item.sellPrice <= 0 || item.buyPrice <= 0) {
            return { breakEvenAmount: 0, isProfitable: false };
        }
        
        const totalCost = item.buyPrice * item.amount;
        const breakEvenAmount = Math.ceil(totalCost / item.sellPrice);
        const isProfitable = breakEvenAmount <= item.amount;
        
        return { breakEvenAmount, isProfitable };
    },
    
    highlightText(text, search) {
        if (!search) return text;
        const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    },

    // Formatierung mit Tausenderpunkten für bessere Lesbarkeit
    formatNumberWithDots(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    
    // Datenbank-Operationen
    async saveCategory(category) {
        await Database.saveData(Database.STORES.ITEMS_DATA, category, this.data[category]);
    },
    
    async loadCollapsedStates() {
        const states = await Database.loadData(Database.STORES.SETTINGS, 'collapsedItemsCategories');
        this.collapsedCategories = states || {};
    },
    
    async saveCollapsedStates() {
        await Database.saveData(Database.STORES.SETTINGS, 'collapsedItemsCategories', this.collapsedCategories);
    },
    
    // Item-Operationen
    async updateItem(category, id, field, value) {
        const item = this.data[category].find(item => item.id === id);
        if (item) {
            item[field] = value;
            this.updateItemRow(category, item);
            await this.saveCategory(category);
            
            if (item.isFavorite) {
                favorites.updateDisplay();
            }
        }
    },
    
    updateItemRow(category, item) {
        const row = document.getElementById(`item-${category}-${item.id}`);
        if (!row) return;
        
        const sellAmountInput = row.querySelector('.sell-amount');
        const currentSellAmount = sellAmountInput ? parseInt(sellAmountInput.value) || item.amount : item.amount;
        const { cost, profit, pct, revenue } = this.profitForItem(item, currentSellAmount);
        const { breakEvenAmount, isProfitable } = this.calculateBreakEven(item);
        
        const costCell = row.querySelector('.cost-cell');
        const revenueCell = row.querySelector('.revenue-cell');
        const profitCell = row.querySelector('.profit-cell');
        const breakEvenCell = row.querySelector('.break-even-cell');
        const favoriteStar = row.querySelector('.favorite-star');
        
        if (costCell) costCell.textContent = this.formatNumberWithDots(cost);
        if (revenueCell) revenueCell.textContent = this.formatNumberWithDots(revenue);
        
        if (profitCell) {
            if (item.sellPrice > 0) {
                profitCell.textContent = `${this.formatNumberWithDots(profit)} (${pct.toFixed(2)}%)`;
                profitCell.className = `p-2 align-top font-semibold ${profit >= 0 ? 'profit-positive' : 'profit-negative'} profit-cell`;
            } else {
                profitCell.textContent = '-';
                profitCell.className = 'p-2 align-top text-gray-500 profit-cell';
            }
        }
        
        if (breakEvenCell) {
            if (item.sellPrice > 0 && item.buyPrice > 0) {
                if (isProfitable) {
                    breakEvenCell.textContent = `✓ Ab ${breakEvenAmount} Stück`;
                    breakEvenCell.className = 'p-2 align-top text-xs text-green-400 break-even-cell';
                } else {
                    breakEvenCell.textContent = `✗ Benötigt ${breakEvenAmount} Stück`;
                    breakEvenCell.className = 'p-2 align-top text-xs text-red-400 break-even-cell';
                }
            } else {
                breakEvenCell.textContent = '-';
                breakEvenCell.className = 'p-2 align-top text-xs text-gray-500 break-even-cell';
            }
        }
        
        if (favoriteStar) {
            favoriteStar.className = `favorite-star ${item.isFavorite ? 'favorited' : 'text-gray-500'}`;
            favoriteStar.textContent = item.isFavorite ? '★' : '☆';
        }
    },
    
    updateAllCalculations() {
        for (const [category, items] of Object.entries(this.data)) {
            for (const item of items) {
                this.updateItemRow(category, item);
            }
        }
        favorites.updateDisplay();
    },
    
    async toggleFavorite(category, id) {
        const item = this.data[category].find(item => item.id === id);
        if (item) {
            item.isFavorite = !item.isFavorite;
            this.updateItemRow(category, item);
            favorites.updateDisplay();
            await this.saveCategory(category);
        }
    },
    
    async deleteItem(category, id) {
        if (confirm('Möchtest du dieses Item wirklich löschen?')) {
            this.data[category] = this.data[category].filter(item => item.id !== id);
            this.renderCategory(category);
            favorites.updateDisplay();
            await this.saveCategory(category);
        }
    },
    
    async deleteCategory(category) {
        if (confirm(`Möchtest du die Kategorie "${category}" wirklich löschen?`)) {
            delete this.data[category];
            await Database.deleteData(Database.STORES.ITEMS_DATA, category);
            this.renderAllCategories();
        }
    },
    
    async addNewItem(category) {
        const newItem = {
            id: this.nextItemId++,
            name: "Neues Item",
            buyPrice: 0,
            sellPrice: 0,
            amount: 1,
            isFavorite: false
        };
        
        this.data[category].push(newItem);
        this.renderCategory(category);
        await this.saveCategory(category);
        
        setTimeout(() => {
            const nameInput = document.getElementById(`item-${category}-${newItem.id}`)?.querySelector('.item-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.select();
            }
        }, 100);
    },
    
    async addNewCategory() {
        const categoryName = prompt('Name der neuen Kategorie:');
        if (categoryName && categoryName.trim() !== '') {
            this.data[categoryName] = [];
            await this.saveCategory(categoryName);
            this.renderAllCategories();
        }
    },
    
    toggleCategory(category) {
        this.collapsedCategories[category] = !this.collapsedCategories[category];
        const content = document.getElementById(`content-items-${category}`);
        const icon = document.getElementById(`icon-items-${category}`);
        
        if (this.collapsedCategories[category]) {
            content.classList.add('hidden');
            icon.textContent = '▶';
        } else {
            content.classList.remove('hidden');
            icon.textContent = '▼';
        }
        this.saveCollapsedStates();
    },
    
    // Rendering mit korrigierter Reihenfolge
    renderCategory(category) {
        const container = document.getElementById(`tbody-items-${category}`);
        if (!container) return;
        
        container.innerHTML = '';
        
        let filteredItems = [...this.data[category]];
        
        if (app.searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(app.searchTerm)
            );
        }
        
        const sortedItems = filteredItems.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return 0;
        });
        
        sortedItems.forEach(item => {
            const { cost, profit, pct, revenue } = this.profitForItem(item);
            const { breakEvenAmount, isProfitable } = this.calculateBreakEven(item);
            
            const row = document.createElement('tr');
            row.id = `item-${category}-${item.id}`;
            row.className = 'border-b border-gray-700 hover:bg-gray-700/40';
            
            row.innerHTML = `
                <td class="p-2 align-top w-8">
                    <span class="favorite-star ${item.isFavorite ? 'favorited' : 'text-gray-500'}" onclick="itemsCalculator.toggleFavorite('${category}', ${item.id})">
                        ${item.isFavorite ? '★' : '☆'}
                    </span>
                </td>
                <td class="p-2 align-top w-48">
                    <input
                        class="w-full bg-transparent outline-none text-yellow-300 item-name"
                        value="${item.name}"
                    />
                </td>
                <td class="p-2 align-top w-24">
                    <input
                        type="number"
                        min="1"
                        class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 buy-amount"
                        value="${item.amount}"
                    />
                </td>
                <td class="p-2 align-top w-24">
                    <input
                        type="number"
                        min="0"
                        class="w-20 border border-gray-600 bg-gray-900 text-orange-300 rounded px-2 py-1 buy-price"
                        value="${item.buyPrice}"
                    />
                </td>
                <td class="p-2 align-top text-yellow-400 cost-cell">${this.formatNumberWithDots(cost)}</td>
                <td class="p-2 align-top w-24">
                    <input
                        type="number"
                        min="0"
                        max="${item.amount}"
                        class="w-20 border border-gray-600 bg-gray-900 text-green-300 rounded px-2 py-1 sell-amount"
                        value="${item.amount}"
                    />
                </td>
                <td class="p-2 align-top">
                    <input
                        type="text"
                        class="w-full border border-gray-600 bg-gray-900 text-right text-yellow-300 rounded px-2 py-1 sell-price"
                        value="${this.formatNumberWithDots(item.sellPrice)}"
                    />
                </td>
                <td class="p-2 align-top text-yellow-400 revenue-cell">${this.formatNumberWithDots(revenue)}</td>
                <td class="p-2 align-top font-semibold ${item.sellPrice > 0 ? (profit >= 0 ? 'profit-positive' : 'profit-negative') : 'text-gray-500'} profit-cell">
                    ${item.sellPrice > 0 ? `${this.formatNumberWithDots(profit)} (${pct.toFixed(2)}%)` : '-'}
                </td>
                <td class="p-2 align-top text-xs break-even-cell">
                    ${item.sellPrice > 0 && item.buyPrice > 0 ? 
                        (isProfitable ? 
                            `<span class="text-green-400">✓ Ab ${breakEvenAmount} Stück</span>` : 
                            `<span class="text-red-400">✗ Benötigt ${breakEvenAmount} Stück</span>`) : 
                        '-'}
                </td>
                <td class="p-2 align-top">
                    <button onclick="itemsCalculator.deleteItem('${category}', ${item.id})" class="text-red-400 hover:text-red-300 transition">
                        🗑️
                    </button>
                </td>
            `;
            
            container.appendChild(row);
            
            // Event-Listener
            const nameInput = row.querySelector('.item-name');
            const buyAmountInput = row.querySelector('.buy-amount');
            const sellAmountInput = row.querySelector('.sell-amount');
            const buyPriceInput = row.querySelector('.buy-price');
            const sellPriceInput = row.querySelector('.sell-price');
            
            nameInput.addEventListener('input', (e) => {
                this.updateItem(category, item.id, 'name', e.target.value);
            });
            
            buyAmountInput.addEventListener('input', (e) => {
                const newAmount = parseInt(e.target.value) || 1;
                this.updateItem(category, item.id, 'amount', newAmount);
                
                // Aktualisiere das Maximum für die Verkaufsmenge
                if (sellAmountInput) {
                    sellAmountInput.max = newAmount;
                    if (parseInt(sellAmountInput.value) > newAmount) {
                        sellAmountInput.value = newAmount;
                        this.updateItemRow(category, item);
                    }
                }
            });
            
            buyPriceInput.addEventListener('input', (e) => {
                this.updateItem(category, item.id, 'buyPrice', parseInt(e.target.value) || 0);
            });
            
            sellPriceInput.addEventListener('input', (e) => {
                // Entferne die Punkte für die Verarbeitung
                const rawValue = e.target.value.replace(/\./g, '');
                const value = parseInt(rawValue) || 0;
                if (!isNaN(value)) {
                    this.updateItem(category, item.id, 'sellPrice', value);
                    // Aktualisiere die Anzeige mit Punkten
                    e.target.value = this.formatNumberWithDots(value);
                }
            });
            
            // Neue Event-Listener für Verkaufsmenge
            sellAmountInput.addEventListener('input', (e) => {
                const newSellAmount = parseInt(e.target.value) || 0;
                // Stelle sicher, dass die Verkaufsmenge nicht größer als die gekaufte Menge ist
                if (newSellAmount > item.amount) {
                    e.target.value = item.amount;
                }
                this.updateItemRow(category, item);
            });

            // Input Formatierung
            buyPriceInput.addEventListener('blur', (e) => {
                const value = parseInt(e.target.value) || 0;
                e.target.value = this.formatNumberWithDots(value);
            });

            buyPriceInput.addEventListener('focus', (e) => {
                e.target.value = e.target.value.replace(/\./g, '');
            });

            sellPriceInput.addEventListener('focus', (e) => {
                e.target.value = e.target.value.replace(/\./g, '');
            });
        });
    },
    
    renderAllCategories() {
        const container = document.getElementById('items-container');
        container.innerHTML = '';
        
        for (const [category, items] of Object.entries(this.data)) {
            const section = document.createElement('section');
            section.className = 'mb-6';
            const key = `items-${category}`;
            
            section.innerHTML = `
                <div class="category-header rounded-lg p-4 mb-0" onclick="itemsCalculator.toggleCategory('${category}')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span id="icon-${key}" class="text-yellow-400">${this.collapsedCategories[category] ? '▶' : '▼'}</span>
                            <h2 class="text-2xl font-bold text-orange-400">${category}</h2>
                            <span class="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">${this.formatNumberWithDots(items.length)} Items</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button 
                                onclick="event.stopPropagation(); itemsCalculator.addNewItem('${category}')" 
                                class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold rounded text-sm hover:opacity-90 transition flex items-center gap-2"
                            >
                                <span>+</span>
                                <span>Item</span>
                            </button>
                            <button 
                                onclick="event.stopPropagation(); itemsCalculator.deleteCategory('${category}')" 
                                class="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
                <div id="content-${key}" class="category-content ${this.collapsedCategories[category] ? 'hidden' : ''}">
                    <div class="bg-gray-800 border border-gray-700 shadow-lg rounded-b-lg p-4">
                        <table class="w-full text-left table-auto border-collapse">
                            <thead>
                                <tr class="text-xs text-gray-400 border-b border-gray-700 uppercase">
                                    <th class="p-2 w-8"></th>
                                    <th class="p-2">Item</th>
                                    <th class="p-2">Einkaufs-<br>menge</th>
                                    <th class="p-2">Einkaufs-<br>preis</th>
                                    <th class="p-2">Einkauf<br>(Gold)</th>
                                    <th class="p-2">Verkaufs-<br>menge</th>
                                    <th class="p-2">Verkaufs-<br>preis</th>
                                    <th class="p-2">Verkauf<br>(Gold)</th>
                                    <th class="p-2">Gewinn /<br>Verlust</th>
                                    <th class="p-2">Gewinn-<br>schwelle</th>
                                    <th class="p-2 w-8"></th>
                                </tr>
                            </thead>
                            <tbody id="tbody-items-${category}">
                                <!-- Items werden hier eingefügt -->
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            container.appendChild(section);
            this.renderCategory(category);
        }
    }
};
