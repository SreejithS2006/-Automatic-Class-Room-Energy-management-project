/**
 * Smart Classroom Energy Monitor - Application Logic
 * Developed by SmartEdge Solutions
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tempValueEl = document.getElementById('temp-value');
    const tempUpdateTimeEl = document.getElementById('temp-update-time');
    const occupancyStatusEl = document.getElementById('occupancy-status');
    const currentTimeEl = document.getElementById('current-time');
    const statusIndicator = document.getElementById('status-indicator');

    // Initial state
    let currentTemp = 24.5;
    let isOccupied = true;

    /**
     * Updates the digital clock in the footer
     */
    function updateClock() {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    /**
     * Simulates temperature fluctuations
     */
    function updateTemperature() {
        // Random fluctuation between -0.2 and +0.2
        const fluctuation = (Math.random() * 0.4) - 0.2;
        currentTemp = Math.max(18, Math.min(32, currentTemp + fluctuation));
        
        // Update UI with animation if significant change
        tempValueEl.textContent = currentTemp.toFixed(1);
        
        // Update "last updated" timestamp
        const now = new Date();
        tempUpdateTimeEl.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    /**
     * Simulates occupancy changes
     */
    function updateOccupancy() {
        // 20% chance to toggle status
        if (Math.random() > 0.8) {
            isOccupied = !isOccupied;
            
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
    }

    // Initialize UI
    updateClock();
    updateTemperature();
    
    // Initial occupancy state
    occupancyStatusEl.innerHTML = '<span class="text-brand-blue animate-pulse">Occupied</span>';

    // Set intervals
    setInterval(updateClock, 1000);
    setInterval(updateTemperature, 3000); // Update temp every 3 seconds
    setInterval(updateOccupancy, 10000);  // Check occupancy every 10 seconds
});
