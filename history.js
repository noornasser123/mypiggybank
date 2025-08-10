document.addEventListener('DOMContentLoaded', function () {
    loadHistory();
});

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('piggyHistory')) || [];
    const container = document.getElementById('historyEntries');

    if (history.length === 0) {
        container.innerHTML = '<p class="no-history">No savings history yet. Save your first calculation from the Dashboard!</p>';
        return;
    }

    // Display all entries (newest first)
    container.innerHTML = history.slice().reverse().map(entry => `
        <div class="history-entry">
            <h3>${entry.date}</h3>
            <div class="history-stats">
                <p><strong>Income:</strong> ${formatCurrency(entry.income, entry.currency)}</p>
                <p><strong>Essentials:</strong> ${formatCurrency(entry.essentials, entry.currency)}</p>
                <p class="highlight-stat">Savings: ${formatCurrency(entry.savings, entry.currency)}</p>
                <p><strong>Fun Money:</strong> ${formatCurrency(entry.fun, entry.currency)}</p>
                <button class="delete-btn" onclick="deleteEntry('${entry.date}')">Delete</button>
            </div>
        </div>
    `).join('');

    // Render chart
    renderAllTimeChart(history);
}

function deleteEntry(date) {
    let history = JSON.parse(localStorage.getItem('piggyHistory')) || [];
    history = history.filter(entry => entry.date !== date);
    localStorage.setItem('piggyHistory', JSON.stringify(history));
    loadHistory(); // Refresh the display
}

function renderAllTimeChart(history) {
    const ctx = document.getElementById('spendingChart').getContext('2d');

    const totals = history.reduce((acc, entry) => {
        acc.essentials += entry.essentials;
        acc.savings += entry.savings;
        acc.fun += entry.fun;
        return acc;
    }, { essentials: 0, savings: 0, fun: 0 });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Essentials', 'Savings', 'Fun Money'],
            datasets: [{
                data: [totals.essentials, totals.savings, totals.fun],
                backgroundColor: [
                    '#CDD4B1', // Eucalyptus
                    '#DCA278', // Clay
                    '#EBECCC'  // Pistachio
                ],
                borderColor: '#FFF9E2',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Jomhuria', cursive",
                            size: 24
                        },
                        color: '#DCA278'
                    }
                }
            }
        }
    });
}

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'OMR' ? 3 : 2
    }).format(amount);
}