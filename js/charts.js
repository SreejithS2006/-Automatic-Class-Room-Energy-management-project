window.initCharts = (data) => {
    // Common Chart Options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8' }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            }
        }
    };

    // Energy Chart (Bar)
    const ctxEnergy = document.getElementById('energyChart').getContext('2d');
    new Chart(ctxEnergy, {
        type: 'bar',
        data: {
            labels: data.energy.map(d => d.label),
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: data.energy.map(d => d.value),
                backgroundColor: '#06b6d4',
                borderRadius: 4,
                hoverBackgroundColor: '#22d3ee'
            }]
        },
        options: commonOptions
    });

    // Temp Chart (Line)
    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: data.temp.map(d => d.label),
            datasets: [{
                label: 'Temperature (°C)',
                data: data.temp.map(d => d.value),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: commonOptions
    });

    // Usage Distribution (Doughnut)
    const ctxUsage = document.getElementById('usageChart').getContext('2d');
    new Chart(ctxUsage, {
        type: 'doughnut',
        data: {
            labels: ['Lighting', 'Fans', 'Standby', 'Other'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#06b6d4', // Cyan
                    '#22c55e', // Green
                    '#ef4444', // Red
                    '#64748b'  // Slate
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...commonOptions,
            scales: { x: { display: false }, y: { display: false } },
            cutout: '70%'
        }
    });
};
