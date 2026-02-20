/**
 * Smart Classroom Energy Monitor - IoT Integration Logic
 * Developed by SmartEdge Solutions
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tempValueEl = document.getElementById('temp-value');
    const tempUpdateTimeEl = document.getElementById('temp-update-time');
    const occupancyStatusEl = document.getElementById('occupancy-status');
    const currentTimeEl = document.getElementById('current-time');
    const statusIndicator = document.getElementById('status-indicator');

    // === FIREBASE CONFIGURATION ===
    // Replace the placeholders below with your actual project config from Firebase Console
    const firebaseConfig = {
        apiKey: "AIzaSyCfZuHB13YusjkMBnbpq0rZ32_2c_thkto",
        authDomain: "auto-classroom-energy-manager.firebaseapp.com",
        databaseURL: "https://auto-classroom-energy-manager-default-rtdb.firebaseio.com",
        projectId: "auto-classroom-energy-manager",
        storageBucket: "auto-classroom-energy-manager.firebasestorage.app",
        messagingSenderId: "658818233323",
        appId: "1:658818233323:web:5c19d4aa5871575221dfae",
        measurementId: "G-9H9ZZLLJZJ"
    };

    // Check if config is still placeholders
    const isConfigPlaceholder = firebaseConfig.apiKey === "YOUR_API_KEY";

    if (isConfigPlaceholder) {
        console.warn("Firebase config is not set. Dashboard is in DEMO mode.");
        startSimulation(); // Fallback to simulation if not configured
    } else {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // Listen for Temperature updates
        database.ref('classroom/temperature').on('value', (snapshot) => {
            const temp = snapshot.val();
            if (temp !== null) {
                tempValueEl.textContent = parseFloat(temp).toFixed(1);
                updateTimestamp(tempUpdateTimeEl);
            }
        });

        // Listen for Occupancy updates
        database.ref('classroom/occupied').on('value', (snapshot) => {
            const isOccupied = snapshot.val();
            if (isOccupied !== null) {
                updateOccupancyUI(isOccupied);
            }
        });
    }

    /**
     * Helper to update UI based on occupancy status
     */
    function updateOccupancyUI(isOccupied) {
        if (isOccupied) {
            occupancyStatusEl.innerHTML = '<span class="text-brand-blue animate-pulse">Occupied</span>';
            statusIndicator.innerHTML = `
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span>
            `;
        } else {
            occupancyStatusEl.innerHTML = '<span class="text-slate-400">Not Occupied</span>';
            statusIndicator.innerHTML = `
                <span class="relative inline-flex rounded-full h-3 w-3 bg-slate-300"></span>
            `;
        }
    }

    /**
     * Helper to update "Last Updated" timestamp
     */
    function updateTimestamp(element) {
        const now = new Date();
        element.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Clock update loop
     */
    function updateClock() {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- DEMO SIMULATION FALLBACK ---
    function startSimulation() {
        let currentTemp = 24.5;
        let isOccupied = true;

        setInterval(() => {
            currentTemp += (Math.random() * 0.4) - 0.2;
            tempValueEl.textContent = currentTemp.toFixed(1);
            updateTimestamp(tempUpdateTimeEl);
        }, 3000);

        setInterval(() => {
            if (Math.random() > 0.8) {
                isOccupied = !isOccupied;
                updateOccupancyUI(isOccupied);
            }
        }, 10000);

        updateOccupancyUI(isOccupied);
    }
});
