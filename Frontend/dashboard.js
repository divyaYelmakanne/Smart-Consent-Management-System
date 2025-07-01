// Dashboard Management
class Dashboard {
    constructor() {
        this.currentConsentPage = 0;
        this.currentAnalyticsPage = 0;
        this.pageSize = 10;
        this.charts = {};
        this.init();
    }

    init() {
        this.loadStats();
        this.loadConsentData();
        this.loadAnalyticsData();
        this.setupCharts();
        this.setupAutoRefresh();
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            overlay.classList.add('hidden');
        }
    }

    async loadStats() {
        try {
            this.showLoading();
            const response = await fetch('http://localhost:3000/api/stats');
            const data = await response.json();

            if (data.success) {
                this.updateStats(data.data);
                this.updateCharts(data.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showError('Failed to load statistics');
        } finally {
            this.hideLoading();
        }
    }

    updateStats(stats) {
        // Update stat cards
        document.getElementById('total-consents').textContent = stats.consents.total.toLocaleString();
        document.getElementById('consents-24h').textContent = stats.consents.last24h.toLocaleString();
        document.getElementById('total-analytics').textContent = stats.analytics.total.toLocaleString();
        document.getElementById('total-marketing').textContent = stats.marketing.total.toLocaleString();

        // Add animation
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    setupCharts() {
        // Consent Breakdown Chart
        const consentCtx = document.getElementById('consentChart');
        if (consentCtx) {
            this.charts.consent = new Chart(consentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['All Accepted', 'Partial', 'Essential Only'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }

        // Timeline Chart
        const timelineCtx = document.getElementById('timelineChart');
        if (timelineCtx) {
            this.charts.timeline = new Chart(timelineCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Consents',
                        data: [],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Analytics',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    updateCharts(stats) {
        // Update consent breakdown chart
        if (this.charts.consent) {
            this.charts.consent.data.datasets[0].data = [
                stats.consents.breakdown.allAccepted,
                stats.consents.breakdown.partialAccepted,
                stats.consents.breakdown.essentialOnly
            ];
            this.charts.consent.update();
        }

        // Update timeline chart with sample data
        if (this.charts.timeline) {
            const labels = [];
            const consentData = [];
            const analyticsData = [];

            // Generate last 7 days data
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                // Simulate data (in real app, this would come from backend)
                consentData.push(Math.floor(Math.random() * 50) + 10);
                analyticsData.push(Math.floor(Math.random() * 200) + 50);
            }

            this.charts.timeline.data.labels = labels;
            this.charts.timeline.data.datasets[0].data = consentData;
            this.charts.timeline.data.datasets[1].data = analyticsData;
            this.charts.timeline.update();
        }
    }

    async loadConsentData(direction = null) {
        try {
            if (direction === 'next') {
                this.currentConsentPage++;
            } else if (direction === 'prev') {
                this.currentConsentPage = Math.max(0, this.currentConsentPage - 1);
            }

            const offset = this.currentConsentPage * this.pageSize;
            const response = await fetch(`http://localhost:3000/api/consent?limit=${this.pageSize}&offset=${offset}`);
            const data = await response.json();

            if (data.success) {
                this.updateConsentTable(data.data);
                this.updateConsentPagination(data.total, data.offset, data.limit);
            }
        } catch (error) {
            console.error('Error loading consent data:', error);
            this.showError('Failed to load consent data');
        }
    }

    updateConsentTable(consentData) {
        const tbody = document.getElementById('consent-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (consentData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No consent data available</h3>
                        <p>Consent records will appear here once users interact with the cookie banner.</p>
                    </td>
                </tr>
            `;
            return;
        }

        consentData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fade-in');

            const essentialStatus = record.consent.essential ? 
                '<span class="consent-status accepted">✓</span>' : 
                '<span class="consent-status declined">✗</span>';

            const analyticsStatus = record.consent.analytics ? 
                '<span class="consent-status accepted">✓</span>' : 
                '<span class="consent-status declined">✗</span>';

            const marketingStatus = record.consent.marketing ? 
                '<span class="consent-status accepted">✓</span>' : 
                '<span class="consent-status declined">✗</span>';

            row.innerHTML = `
                <td>${record.id.substring(0, 8)}...</td>
                <td>${essentialStatus}</td>
                <td>${analyticsStatus}</td>
                <td>${marketingStatus}</td>
                <td>${new Date(record.timestamp).toLocaleString()}</td>
                <td title="${record.userAgent}">${this.truncateUserAgent(record.userAgent)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    updateConsentPagination(total, offset, limit) {
        const pageInfo = document.getElementById('consent-page-info');
        const currentPage = Math.floor(offset / limit) + 1;
        const totalPages = Math.ceil(total / limit);

        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${total} total records)`;
        }

        // Update button states
        const prevBtn = document.querySelector('[onclick="loadConsentData(\'prev\')"]');
        const nextBtn = document.querySelector('[onclick="loadConsentData(\'next\')"]');

        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages;
        }
    }

    async loadAnalyticsData(direction = null) {
        try {
            if (direction === 'next') {
                this.currentAnalyticsPage++;
            } else if (direction === 'prev') {
                this.currentAnalyticsPage = Math.max(0, this.currentAnalyticsPage - 1);
            }

            const offset = this.currentAnalyticsPage * this.pageSize;
            const response = await fetch(`http://localhost:3000/api/analytics?limit=${this.pageSize}&offset=${offset}`);
            const data = await response.json();

            if (data.success) {
                this.updateAnalyticsTable(data.data);
                this.updateAnalyticsPagination(data.total, data.offset, data.limit);
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
            this.showError('Failed to load analytics data');
        }
    }

    updateAnalyticsTable(analyticsData) {
        const tbody = document.getElementById('analytics-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (analyticsData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-chart-line"></i>
                        <h3>No analytics data available</h3>
                        <p>Analytics events will appear here once users with analytics consent interact with the site.</p>
                    </td>
                </tr>
            `;
            return;
        }

        analyticsData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fade-in');

            row.innerHTML = `
                <td>${record.id.substring(0, 8)}...</td>
                <td><span class="consent-status accepted">${record.type}</span></td>
                <td title="${record.url}">${this.truncateUrl(record.url)}</td>
                <td>${new Date(record.timestamp).toLocaleString()}</td>
                <td title="${record.userAgent}">${this.truncateUserAgent(record.userAgent)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    updateAnalyticsPagination(total, offset, limit) {
        const pageInfo = document.getElementById('analytics-page-info');
        const currentPage = Math.floor(offset / limit) + 1;
        const totalPages = Math.ceil(total / limit);

        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${total} total records)`;
        }

        // Update button states
        const prevBtn = document.querySelector('[onclick="loadAnalyticsData(\'prev\')"]');
        const nextBtn = document.querySelector('[onclick="loadAnalyticsData(\'next\')"]');

        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages;
        }
    }

    truncateUserAgent(userAgent) {
        if (!userAgent) return 'N/A';
        return userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent;
    }

    truncateUrl(url) {
        if (!url) return 'N/A';
        return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    setupAutoRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.loadStats();
        }, 30000);
    }
}

// Global functions for button clicks
function refreshData() {
    if (window.dashboard) {
        window.dashboard.loadStats();
        window.dashboard.loadConsentData();
        window.dashboard.loadAnalyticsData();
    }
}

function loadConsentData(direction) {
    if (window.dashboard) {
        window.dashboard.loadConsentData(direction);
    }
}

function loadAnalyticsData(direction) {
    if (window.dashboard) {
        window.dashboard.loadAnalyticsData(direction);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new Dashboard();
    
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 