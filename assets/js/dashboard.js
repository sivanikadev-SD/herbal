/* ============================================================
   HERBAL APOTHECARY – DASHBOARD JS
   Handles: sidebar nav panels, sidebar toggle, charts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── SIDEBAR MOBILE TOGGLE ─────────────────────────────── */
    const sidebar = document.getElementById('dash-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    let backdrop = document.getElementById('sidebar-backdrop');

    if (!backdrop && sidebar) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.id = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    function openSidebar() {
        sidebar?.classList.add('open');
        backdrop?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebar?.classList.remove('open');
        backdrop?.classList.remove('show');
        document.body.style.overflow = '';
    }

    toggleBtn?.addEventListener('click', () => {
        sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    backdrop?.addEventListener('click', closeSidebar);

    /* Auto-close on resize if desktop */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeSidebar();
    });

    /* ── SIDEBAR PANEL SWITCHING ───────────────────────────── */
    const links = document.querySelectorAll('.sidebar-link[data-panel]');
    const panels = document.querySelectorAll('.dash-panel');

    function switchPanel(panelId) {
        panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + panelId));
        links.forEach(l => l.classList.toggle('active', l.dataset.panel === panelId));
    }

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchPanel(link.dataset.panel);
            if (window.innerWidth <= 1024) closeSidebar();
        });
    });

    /* Also allow anchor links like <a href="#orders" data-panel="orders"> */
    document.querySelectorAll('[data-panel]:not(.sidebar-link)').forEach(el => {
        el.addEventListener('click', e => {
            const panel = el.dataset.panel;
            if (panel) { e.preventDefault(); switchPanel(panel); }
        });
    });

    /* ── MODAL ─────────────────────────────────────────────── */
    const productModal = document.getElementById('product-modal');
    const openModalBtn = document.getElementById('open-product-modal');

    openModalBtn?.addEventListener('click', () => {
        productModal?.classList.add('open');
    });
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', e => {
            if (e.target === el) productModal?.classList.remove('open');
        });
    });

    /* ── ADMIN BUTTON HANDLERS ─────────────────────────────── */
    document.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            if (row && confirm('Delete this item?')) {
                row.style.opacity = '0';
                row.style.transition = 'opacity .3s';
                setTimeout(() => row.remove(), 300);
                showToast('Item deleted', 'warning');
            }
        });
    });
    document.querySelectorAll('.admin-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => showToast('Edit panel coming soon!'));
    });

    /* ── PROFILE FORM ──────────────────────────────────────── */
    document.getElementById('profile-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Profile updated successfully ✅');
    });

    /* ── PASSWORD FORM ─────────────────────────────────────── */
    document.getElementById('password-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Password changed successfully ✅');
    });

    /* ── TABLE SEARCH ──────────────────────────────────────── */
    function initSearch(inputId, tableSelector) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', () => {
            const q = input.value.toLowerCase();
            document.querySelectorAll(tableSelector + ' tbody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
    initSearch('admin-order-search', '#admin-orders-table-overview');
    initSearch('order-search', '.data-table');
    initSearch('product-search', '#products-table');

    /* ── INIT CHARTS ───────────────────────────────────────── */
    if (typeof Chart === 'undefined') return;

    const chartDefaults = {
        font: { family: "'Inter', sans-serif", size: 12 },
        color: '#6E7D6F',
    };
    Chart.defaults.font.family = chartDefaults.font.family;
    Chart.defaults.font.size = chartDefaults.font.size;
    Chart.defaults.color = chartDefaults.color;

    /* Revenue Chart */
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
                datasets: [{
                    label: 'Revenue',
                    data: [12800, 15200, 18600, 22100, 20900, 24820],
                    fill: true,
                    backgroundColor: 'rgba(74,124,89,.12)',
                    borderColor: '#4A7C59',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#4A7C59',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: .4,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,.05)' },
                        ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' },
                    },
                    x: { grid: { display: false } },
                },
            },
        });
    }

    /* Category Donut */
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Herbal Teas', 'Tinctures', 'Capsules', 'Salves', 'Oils', 'Bundles'],
                datasets: [{
                    data: [38, 22, 18, 9, 8, 5],
                    backgroundColor: ['#4A7C59', '#6BA07A', '#C46A2B', '#E6D5B8', '#2D4A35', '#D98A50'],
                    borderWidth: 0,
                    hoverOffset: 6,
                }],
            },
            options: {
                responsive: true,
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
                    },
                },
            },
        });
    }

    /* Traffic Chart */
    const trafficCtx = document.getElementById('traffic-chart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'bar',
            data: {
                labels: ['Organic', 'Social', 'Email', 'Direct', 'Referral'],
                datasets: [{
                    label: 'Sessions',
                    data: [4820, 3210, 2180, 1540, 890],
                    backgroundColor: ['#4A7C59', '#6BA07A', '#C46A2B', '#E6D5B8', '#2D4A35'],
                    borderRadius: 6,
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } },
                    x: { grid: { display: false } },
                },
            },
        });
    }

});
