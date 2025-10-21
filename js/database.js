// Datenbank-Management
const Database = {
    // Datenbank-Konstanten
    DB_NAME: 'TalerRechnerDB',
    DB_VERSION: 1,
    
    // Store-Namen
    STORES: {
        TALER_ITEMS: 'talerItems',
        ITEMS_DATA: 'itemsData',
        SETTINGS: 'settings'
    },

    // Datenbank-Instanz
    db: null,

    // Datenbank initialisieren
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Taler Items Store
                if (!db.objectStoreNames.contains(this.STORES.TALER_ITEMS)) {
                    const store = db.createObjectStore(this.STORES.TALER_ITEMS, { keyPath: 'category' });
                    store.createIndex('category', 'category', { unique: true });
                }
                
                // Items Data Store
                if (!db.objectStoreNames.contains(this.STORES.ITEMS_DATA)) {
                    const store = db.createObjectStore(this.STORES.ITEMS_DATA, { keyPath: 'category' });
                    store.createIndex('category', 'category', { unique: true });
                }
                
                // Settings Store
                if (!db.objectStoreNames.contains(this.STORES.SETTINGS)) {
                    const store = db.createObjectStore(this.STORES.SETTINGS, { keyPath: 'key' });
                    store.createIndex('key', 'key', { unique: true });
                }
            };
        });
    },

    // Daten speichern
    async saveData(storeName, key, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put({ [storeName === this.STORES.SETTINGS ? 'key' : 'category']: key, data });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Daten laden
    async loadData(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    },

    // Alle Daten aus einem Store laden
    async loadAllData(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const result = {};
                request.result.forEach(item => {
                    result[item.category || item.key] = item.data;
                });
                resolve(result);
            };
            request.onerror = () => reject(request.error);
        });
    },

    // Daten löschen
    async deleteData(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // Store komplett leeren
    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};
