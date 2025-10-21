// Tab-Management
const tabs = {
    currentTab: 'taler',
    
    init() {
        // Event-Listener für Tabs
        document.getElementById('tab-taler').addEventListener('click', () => this.switchTab('taler'));
        document.getElementById('tab-items').addEventListener('click', () => this.switchTab('items'));
    },

    switchTab(tabName) {
        // Aktiven Tab deaktivieren
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden-tab');
        });
        
        // Neuen Tab aktivieren
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.getElementById(`tab-${tabName}-content`).classList.remove('hidden-tab');
        
        this.currentTab = tabName;
        
        // Titel und Beschreibung anpassen
        const title = document.getElementById('main-title');
        const description = document.getElementById('main-description');
        const priceLabel = document.getElementById('price-label');
        
        if (tabName === 'taler') {
            title.textContent = 'Gold ↔ Taler Rechner';
            description.textContent = 'Berechne Gewinn & Verlust für Mall-Items — mit Mengenangabe.';
            priceLabel.textContent = 'Talerpreis (1 Taler = X Gold)';
            document.getElementById('taler-display').classList.remove('hidden');
            document.getElementById('edit-taler-btn').classList.remove('hidden');
        } else {
            title.textContent = 'Items Umrechner';
            description.textContent = 'Berechne Gewinn & Verlust für spezielle Items wie Engelsfedern, Gillionsteine, etc.';
            priceLabel.textContent = 'Preis pro Stück';
            document.getElementById('taler-display').classList.add('hidden');
            document.getElementById('edit-taler-btn').classList.add('hidden');
        }
        
        favorites.updateDisplay();
    }
};
