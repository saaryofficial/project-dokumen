const loginForm = document.getElementById('loginForm');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.menu-content');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');

const pageMap = {
  dashboard: { title: 'Dashboard Operasional', subtitle: 'Pemantauan real-time layanan tenaga outsourcing untuk seluruh mitra.' },
  ringkasan: { title: 'Ringkasan Eksekutif', subtitle: 'Ikhtisar kinerja strategis perusahaan dan operasional.' },
  client: { title: 'Client / Mitra', subtitle: 'Daftar mitra dan status kontrak layanan outsourcing.' },
  'tenaga-kerja': { title: 'Tenaga Kerja', subtitle: 'Data dan status tenaga kerja outsourcing.' },
  penempatan: { title: 'Penempatan', subtitle: 'Distribusi dan monitoring penempatan tenaga kerja.' },
  kehadiran: { title: 'Kehadiran', subtitle: 'Pemantauan absensi dan kedisiplinan pekerja.' },
  payroll: { title: 'Payroll', subtitle: 'Pengelolaan gaji dan komponen pembayaran karyawan.' },
  keuangan: { title: 'Keuangan', subtitle: 'Ringkasan finansial dan pembayaran client.' },
  laporan: { title: 'Laporan', subtitle: 'Pusat laporan operasional dan manajemen.' },
  pengaturan: { title: 'Pengaturan', subtitle: 'Pengaturan sistem, akses, dan konfigurasi akun.' }
};

function activateMenu(menuKey) {
  menuItems.forEach((item) => item.classList.toggle('active', item.dataset.menu === menuKey));
  contentSections.forEach((section) => section.classList.toggle('active', section.dataset.content === menuKey));
  pageTitle.textContent = pageMap[menuKey].title;
  pageSubtitle.textContent = pageMap[menuKey].subtitle;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  activateMenu('dashboard');
});

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    activateMenu(item.dataset.menu);
  });
});

logoutBtn.addEventListener('click', () => {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
});
