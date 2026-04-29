const loginForm = document.getElementById('loginForm');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarMenu = document.getElementById('sidebarMenu');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const contentHost = document.getElementById('contentHost');

const menuConfig = [
  { key: 'dashboard', label: 'Dashboard', title: 'Dashboard Operasional', subtitle: 'Pemantauan real-time layanan tenaga outsourcing untuk seluruh mitra.' },
  { key: 'ringkasan', label: 'Ringkasan Eksekutif', title: 'Ringkasan Eksekutif', subtitle: 'Ikhtisar kinerja strategis perusahaan dan operasional.' },
  { key: 'client', label: 'Client / Mitra', title: 'Client / Mitra', subtitle: 'Daftar mitra dan status kontrak layanan outsourcing.' },
  { key: 'tenaga-kerja', label: 'Tenaga Kerja', title: 'Tenaga Kerja', subtitle: 'Data dan status tenaga kerja outsourcing.' },
  { key: 'penempatan', label: 'Penempatan', title: 'Penempatan', subtitle: 'Distribusi dan monitoring penempatan tenaga kerja.' },
  { key: 'kehadiran', label: 'Kehadiran', title: 'Kehadiran', subtitle: 'Pemantauan absensi dan kedisiplinan pekerja.' },
  { key: 'payroll', label: 'Payroll', title: 'Payroll', subtitle: 'Pengelolaan gaji dan komponen pembayaran karyawan.' },
  { key: 'keuangan', label: 'Keuangan', title: 'Keuangan', subtitle: 'Ringkasan finansial dan pembayaran client.' },
  { key: 'laporan', label: 'Laporan', title: 'Laporan', subtitle: 'Pusat laporan operasional dan manajemen.' },
  { key: 'pengaturan', label: 'Pengaturan', title: 'Pengaturan', subtitle: 'Pengaturan sistem, akses, dan konfigurasi akun.' }
];

const menuContent = {
  dashboard: `
    <div class="cards-grid">
      <article class="stat-card"><h3>Total Klien Aktif</h3><p>10 Perusahaan</p><small>PT. A s.d PT. J</small></article>
      <article class="stat-card"><h3>Tenaga Kerja Aktif</h3><p>1.284 Orang</p><small>+42 bulan ini</small></article>
      <article class="stat-card"><h3>Tingkat Kehadiran</h3><p>96.8%</p><small>Update: hari ini</small></article>
      <article class="stat-card"><h3>Status Payroll</h3><p>Siap Diproses</p><small>Periode April 2026</small></article>
    </div>
    <div class="panel-grid">
      <article class="panel"><h3>Daftar Client / Mitra</h3><ul class="client-list"><li>PT. A</li><li>PT. B</li><li>PT. C</li><li>PT. D</li><li>PT. E</li><li>PT. F</li><li>PT. G</li><li>PT. H</li><li>PT. I</li><li>PT. J</li></ul></article>
      <article class="panel"><h3>Aktivitas Terbaru</h3><ul class="activity-list"><li>Penempatan baru 15 tenaga kerja ke PT. C.</li><li>Rekap kehadiran shift pagi selesai diproses.</li><li>Draft laporan keuangan mingguan tersedia.</li><li>Payroll batch #042 siap approval manajemen.</li></ul></article>
    </div>`,
  ringkasan: `<article class="panel"><h3>Ringkasan Eksekutif</h3><p class="desc">KPI utama perusahaan dan pencapaian periode berjalan.</p><ul class="activity-list"><li>Pendapatan jasa outsourcing naik 12% QoQ.</li><li>Retensi mitra strategis mencapai 98%.</li><li>SLA operasional tercapai 97.4%.</li></ul></article>`,
  client: `<article class="panel"><h3>Client / Mitra</h3><p class="desc">Data mitra aktif dan status kontrak layanan.</p><ul class="client-list"><li>PT. A - Kontrak aktif</li><li>PT. B - Kontrak aktif</li><li>PT. C - Perpanjangan Q3</li><li>PT. D - Kontrak aktif</li><li>PT. E - Kontrak aktif</li><li>PT. F - Onboarding</li><li>PT. G - Kontrak aktif</li><li>PT. H - Kontrak aktif</li><li>PT. I - Audit SLA</li><li>PT. J - Kontrak aktif</li></ul></article>`,
  'tenaga-kerja': `<article class="panel"><h3>Tenaga Kerja</h3><p class="desc">Pengelolaan data pekerja outsourcing.</p><div class="simple-grid"><div><strong>Total Workforce</strong><span>1.284</span></div><div><strong>Kontrak Akan Habis</strong><span>74</span></div><div><strong>Siap Penempatan</strong><span>112</span></div></div></article>`,
  penempatan: `<article class="panel"><h3>Penempatan</h3><p class="desc">Monitoring distribusi tenaga kerja per client.</p><ul class="activity-list"><li>PT. A: 190 personel</li><li>PT. C: 210 personel</li><li>PT. F: 120 personel</li><li>PT. J: 98 personel</li></ul></article>`,
  kehadiran: `<article class="panel"><h3>Kehadiran</h3><p class="desc">Rekap absensi harian, mingguan, dan bulanan.</p><div class="simple-grid"><div><strong>Hadir Hari Ini</strong><span>1.233</span></div><div><strong>Izin</strong><span>31</span></div><div><strong>Alpha</strong><span>20</span></div></div></article>`,
  payroll: `<article class="panel"><h3>Payroll</h3><p class="desc">Pemrosesan gaji, tunjangan, dan potongan.</p><ul class="activity-list"><li>Periode: April 2026</li><li>Batch disiapkan: 12</li><li>Status approval: 9/12 selesai</li></ul></article>`,
  keuangan: `<article class="panel"><h3>Keuangan</h3><p class="desc">Arus kas, tagihan, dan pembayaran client.</p><div class="simple-grid"><div><strong>Invoice Terbit</strong><span>Rp 4.2 M</span></div><div><strong>Pembayaran Masuk</strong><span>Rp 3.6 M</span></div><div><strong>Piutang Berjalan</strong><span>Rp 600 Jt</span></div></div></article>`,
  laporan: `<article class="panel"><h3>Laporan</h3><p class="desc">Unduh laporan operasional dan manajerial.</p><ul class="activity-list"><li>Laporan kehadiran bulanan</li><li>Laporan payroll per client</li><li>Laporan SLA & produktivitas</li></ul></article>`,
  pengaturan: `<article class="panel"><h3>Pengaturan</h3><p class="desc">Konfigurasi pengguna, role akses, dan preferensi sistem.</p><ul class="activity-list"><li>Manajemen akun admin</li><li>Hak akses berbasis peran</li><li>Template notifikasi</li></ul></article>`
};

function renderMenu() {
  sidebarMenu.innerHTML = menuConfig
    .map((menu, idx) => `<button class="menu-item ${idx === 0 ? 'active' : ''}" data-menu="${menu.key}">${menu.label}</button>`)
    .join('');
}

function activateMenu(menuKey) {
  const selectedMenu = menuConfig.find((menu) => menu.key === menuKey) || menuConfig[0];
  document
    .querySelectorAll('.menu-item')
    .forEach((item) => item.classList.toggle('active', item.dataset.menu === selectedMenu.key));
  pageTitle.textContent = selectedMenu.title;
  pageSubtitle.textContent = selectedMenu.subtitle;
  contentHost.innerHTML = menuContent[selectedMenu.key] ?? '<article class="panel"><h3>Data belum tersedia</h3></article>';
}

renderMenu();
activateMenu('dashboard');

sidebarMenu.addEventListener('click', (event) => {
  const menuItem = event.target.closest('.menu-item');
  if (!menuItem) return;
  activateMenu(menuItem.dataset.menu);
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  activateMenu('dashboard');
});

logoutBtn.addEventListener('click', () => {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
});
