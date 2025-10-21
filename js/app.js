// Haupt-Applikation
const app = {
    // Globale Variablen
    talerPrice: 120000,
    isEditingTaler: false,
    searchTerm: '',
    
    // Initialisierung
    async init() {
        try {
            // Datenbank initialisieren
            await Database.init();
            
            // Standarddaten laden oder erstellen
            await this.loadDefaultData();
            
            // UI initialisieren
            this.initUI();
            
            console.log('App erfolgreich initialisiert');
        } catch (error) {
            console.error('Fehler bei der Initialisierung:', error);
        }
    },

    // Standarddaten laden oder erstellen
    async loadDefaultData() {
        // Taler Daten laden
        let talerData = await Database.loadAllData(Database.STORES.TALER_ITEMS);
        if (Object.keys(talerData).length === 0) {
            // Standarddaten speichern
            for (const [category, items] of Object.entries(DEFAULT_TALER_DATA)) {
                await Database.saveData(Database.STORES.TALER_ITEMS, category, items);
            }
            talerData = DEFAULT_TALER_DATA;
        }
        
        // Items Daten laden
        let itemsData = await Database.loadAllData(Database.STORES.ITEMS_DATA);
        if (Object.keys(itemsData).length === 0) {
            // Standarddaten speichern
            for (const [category, items] of Object.entries(DEFAULT_ITEMS_DATA)) {
                await Database.saveData(Database.STORES.ITEMS_DATA, category, items);
            }
            itemsData = DEFAULT_ITEMS_DATA;
        }
        
        // Einstellungen laden
        const settings = await Database.loadData(Database.STORES.SETTINGS, 'talerPrice');
        if (settings) {
            this.talerPrice = settings;
            document.getElementById('taler-value').textContent = this.formatNumber(this.talerPrice);
        }

        // Module initialisieren
        talerCalculator.init(talerData);
        itemsCalculator.init(itemsData);
        tabs.init();
        favorites.init();
    },

    // UI initialisieren
    initUI() {
        // Event-Listener für Taler-Preis
        document.getElementById('edit-taler-btn').addEventListener('click', () => this.toggleTalerEdit());
        document.getElementById('taler-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveTalerPrice();
            }
        });
        
        // Event-Listener für Suche
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.performSearch();
        });
    },

    // Hilfsfunktionen
    formatNumber(num) {
        return num.toLocaleString('de-DE');
    },

    parseNumber(str) {
        return Number(str.replace(/\./g, '').replace(/,/g, '.'));
    },

    // Taler-Preis Funktionen
    toggleTalerEdit() {
        this.isEditingTaler = !this.isEditingTaler;
        
        const display = document.getElementById('taler-display');
        const edit = document.getElementById('taler-edit');
        const button = document.getElementById('edit-taler-btn');
        
        if (this.isEditingTaler) {
            display.classList.add('hidden');
            edit.classList.remove('hidden');
            button.textContent = 'Abbrechen';
            
            const input = document.getElementById('taler-input');
            input.value = this.talerPrice;
            input.focus();
            input.select();
        } else {
            display.classList.remove('hidden');
            edit.classList.add('hidden');
            button.textContent = 'Preis ändern';
        }
    },

    async saveTalerPrice() {
        const input = document.getElementById('taler-input');
        const newPrice = parseInt(input.value);
        
        if (!isNaN(newPrice) && newPrice > 0) {
            this.talerPrice = newPrice;
            document.getElementById('taler-value').textContent = this.formatNumber(this.talerPrice);
            
            // In Datenbank speichern
            await Database.saveData(Database.STORES.SETTINGS, 'talerPrice', this.talerPrice);
            
            // Berechnungen aktualisieren
            talerCalculator.updateAllCalculations();
            itemsCalculator.updateAllCalculations();
            favorites.updateDisplay();
        }
        
        this.toggleTalerEdit();
    },

    // Suchfunktion
    performSearch() {
        if (tabs.currentTab === 'taler') {
            talerCalculator.renderAllCategories();
        } else {
            itemsCalculator.renderAllCategories();
        }
        favorites.updateDisplay();
    }
};

// App starten
document.addEventListener('DOMContentLoaded', () => app.init());
