const STORAGE_KEY = 'cgm_system_db_v1';
const defaultDB = {
  clients: [{ id: 1, nama: 'PT. A', pic: 'Budi', status: 'Aktif' }],
  workers: [{ id: 1, nama: 'Andi', client: 'PT. A', jabatan: 'Security', gajiPokok: 4500000, tunjangan: 500000, bpjs: 150000 }],
  payrolls: [],
  users: [{ id: 1, nama: 'Admin Utama', email: 'admin@caturgunamandiri.co.id', role: 'Admin' }]
};
let db = loadDB();

const menuConfig = [
  ['dashboard', 'Dashboard'], ['ringkasan', 'Ringkasan Eksekutif'], ['client', 'Client / Mitra'], ['tenaga', 'Tenaga Kerja'],
  ['penempatan', 'Penempatan'], ['kehadiran', 'Kehadiran'], ['payroll', 'Payroll'], ['keuangan', 'Keuangan'], ['laporan', 'Laporan'], ['pengaturan', 'Pengaturan']
].map(([key, label]) => ({ key, label }));

const el = (id) => document.getElementById(id);
const formatIDR = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);

function loadDB() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultDB); } catch { return structuredClone(defaultDB); } }
function saveDB() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function nextId(arr) { return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1; }

function renderMenu() {
  el('sidebarMenu').innerHTML = menuConfig.map((m, i) => `<button class="menu-item ${i===0?'active':''}" data-menu="${m.key}">${m.label}</button>`).join('');
}

function setTitle(key) {
  const found = menuConfig.find((m) => m.key === key);
  el('pageTitle').textContent = found?.label || 'Dashboard';
  el('pageSubtitle').textContent = `Modul ${found?.label || 'Dashboard'} siap dioperasikan.`;
}

function renderDashboard() {
  const totalGaji = db.payrolls.reduce((a, b) => a + b.takeHomePay, 0);
  return `<div class="stats"><div class="stat"><h4>Total Client</h4><p>${db.clients.length}</p></div><div class="stat"><h4>Tenaga Kerja</h4><p>${db.workers.length}</p></div><div class="stat"><h4>User Sistem</h4><p>${db.users.length}</p></div><div class="stat"><h4>Total THP Payroll</h4><p>${formatIDR(totalGaji)}</p></div></div>`;
}

function renderClients() {
  return `<div class="panel"><h3>CRUD Client / Mitra</h3><form id="clientForm" class="form-grid"><input type="hidden" id="clientId"><input id="clientNama" placeholder="Nama PT" required><input id="clientPic" placeholder="PIC" required><select id="clientStatus"><option>Aktif</option><option>Onboarding</option><option>Nonaktif</option></select><button>Simpan Client</button></form><table class="table"><thead><tr><th>Nama</th><th>PIC</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${db.clients.map((c)=>`<tr><td>${c.nama}</td><td>${c.pic}</td><td>${c.status}</td><td class="actions"><button class="btn-secondary" onclick="editClient(${c.id})">Edit</button><button class="btn-danger" onclick="deleteClient(${c.id})">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
}

function renderWorkers() {
  return `<div class="panel"><h3>CRUD Tenaga Kerja</h3><form id="workerForm" class="form-grid"><input type="hidden" id="workerId"><input id="workerNama" placeholder="Nama" required><input id="workerJabatan" placeholder="Jabatan" required><select id="workerClient">${db.clients.map((c)=>`<option>${c.nama}</option>`).join('')}</select><input id="workerPokok" type="number" placeholder="Gaji Pokok" required><input id="workerTunjangan" type="number" placeholder="Tunjangan" required><input id="workerBpjs" type="number" placeholder="BPJS" required><button>Simpan Tenaga Kerja</button></form><table class="table"><thead><tr><th>Nama</th><th>Client</th><th>Jabatan</th><th>Komponen Gaji</th><th>Aksi</th></tr></thead><tbody>${db.workers.map((w)=>`<tr><td>${w.nama}</td><td>${w.client}</td><td>${w.jabatan}</td><td>${formatIDR(w.gajiPokok)} + ${formatIDR(w.tunjangan)} - ${formatIDR(w.bpjs)}</td><td class="actions"><button class="btn-secondary" onclick="editWorker(${w.id})">Edit</button><button class="btn-danger" onclick="deleteWorker(${w.id})">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
}

function renderPayroll() {
  return `<div class="grid-2"><div class="panel"><h3>Hitung Payroll Otomatis</h3><form id="payrollForm" class="form-grid"><select id="payrollWorker">${db.workers.map((w)=>`<option value="${w.id}">${w.nama} - ${w.client}</option>`).join('')}</select><input id="payrollHadir" type="number" placeholder="Hari Hadir" required><input id="payrollLemburJam" type="number" placeholder="Jam Lembur" required><input id="payrollPotongan" type="number" placeholder="Potongan Lain" value="0"><button class="btn-good">Hitung & Simpan Payroll</button></form><p>Rumus: THP = Gaji Pokok + Tunjangan + (LemburJam x 25.000) - BPJS - Potongan + Bonus Kehadiran (jika hadir ≥ 24 hari = 200.000)</p></div><div class="panel"><h3>Riwayat Payroll</h3><table class="table"><thead><tr><th>Nama</th><th>Hadir</th><th>Lembur</th><th>THP</th><th>Aksi</th></tr></thead><tbody>${db.payrolls.map((p)=>`<tr><td>${p.nama}</td><td>${p.hadir}</td><td>${p.lemburJam} jam</td><td>${formatIDR(p.takeHomePay)}</td><td><button class="btn-danger" onclick="deletePayroll(${p.id})">Hapus</button></td></tr>`).join('')}</tbody></table></div></div>`;
}

function renderUsers() {
  return `<div class="panel"><h3>Pengaturan User (CRUD)</h3><form id="userForm" class="form-grid"><input type="hidden" id="userId"><input id="userNama" placeholder="Nama User" required><input id="userEmail" type="email" placeholder="Email" required><select id="userRole"><option>Admin</option><option>HR</option><option>Finance</option></select><button>Simpan User</button></form><table class="table"><thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Aksi</th></tr></thead><tbody>${db.users.map((u)=>`<tr><td>${u.nama}</td><td>${u.email}</td><td>${u.role}</td><td class="actions"><button class="btn-secondary" onclick="editUser(${u.id})">Edit</button><button class="btn-danger" onclick="deleteUser(${u.id})">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
}

function renderModule(key) {
  if (key === 'dashboard' || key === 'ringkasan' || key === 'keuangan' || key === 'laporan' || key === 'kehadiran' || key === 'penempatan') return renderDashboard();
  if (key === 'client') return renderClients();
  if (key === 'tenaga') return renderWorkers();
  if (key === 'payroll') return renderPayroll();
  if (key === 'pengaturan') return renderUsers();
  return '<div class="panel">Modul belum tersedia.</div>';
}

function activateMenu(key) {
  document.querySelectorAll('.menu-item').forEach((btn)=>btn.classList.toggle('active', btn.dataset.menu===key));
  setTitle(key);
  el('contentHost').innerHTML = renderModule(key);
  bindForms(key);
}

function bindForms(key) {
  if (key === 'client') el('clientForm').onsubmit = saveClient;
  if (key === 'tenaga') el('workerForm').onsubmit = saveWorker;
  if (key === 'payroll') el('payrollForm').onsubmit = savePayroll;
  if (key === 'pengaturan') el('userForm').onsubmit = saveUser;
}

function saveClient(e){e.preventDefault(); const id=+el('clientId').value; const data={id:id||nextId(db.clients), nama:el('clientNama').value, pic:el('clientPic').value, status:el('clientStatus').value}; db.clients=id?db.clients.map((x)=>x.id===id?data:x):[...db.clients,data]; saveDB(); activateMenu('client');}
function editClient(id){const c=db.clients.find((x)=>x.id===id); el('clientId').value=c.id; el('clientNama').value=c.nama; el('clientPic').value=c.pic; el('clientStatus').value=c.status;}
function deleteClient(id){db.clients=db.clients.filter((x)=>x.id!==id); saveDB(); activateMenu('client');}

function saveWorker(e){e.preventDefault(); const id=+el('workerId').value; const data={id:id||nextId(db.workers), nama:el('workerNama').value, client:el('workerClient').value, jabatan:el('workerJabatan').value, gajiPokok:+el('workerPokok').value, tunjangan:+el('workerTunjangan').value, bpjs:+el('workerBpjs').value}; db.workers=id?db.workers.map((x)=>x.id===id?data:x):[...db.workers,data]; saveDB(); activateMenu('tenaga');}
function editWorker(id){const w=db.workers.find((x)=>x.id===id); el('workerId').value=w.id; el('workerNama').value=w.nama; el('workerClient').value=w.client; el('workerJabatan').value=w.jabatan; el('workerPokok').value=w.gajiPokok; el('workerTunjangan').value=w.tunjangan; el('workerBpjs').value=w.bpjs;}
function deleteWorker(id){db.workers=db.workers.filter((x)=>x.id!==id); saveDB(); activateMenu('tenaga');}

function savePayroll(e){e.preventDefault(); const worker=db.workers.find((w)=>w.id===+el('payrollWorker').value); if(!worker) return; const hadir=+el('payrollHadir').value; const lemburJam=+el('payrollLemburJam').value; const potongan=+el('payrollPotongan').value; const bonus=hadir>=24?200000:0; const lembur=lemburJam*25000; const takeHomePay=worker.gajiPokok+worker.tunjangan+lembur+bonus-worker.bpjs-potongan; db.payrolls=[...db.payrolls,{id:nextId(db.payrolls), nama:worker.nama, hadir, lemburJam, potongan, bonus, takeHomePay}]; saveDB(); activateMenu('payroll');}
function deletePayroll(id){db.payrolls=db.payrolls.filter((x)=>x.id!==id); saveDB(); activateMenu('payroll');}

function saveUser(e){e.preventDefault(); const id=+el('userId').value; const data={id:id||nextId(db.users), nama:el('userNama').value, email:el('userEmail').value, role:el('userRole').value}; db.users=id?db.users.map((x)=>x.id===id?data:x):[...db.users,data]; saveDB(); activateMenu('pengaturan');}
function editUser(id){const u=db.users.find((x)=>x.id===id); el('userId').value=u.id; el('userNama').value=u.nama; el('userEmail').value=u.email; el('userRole').value=u.role;}
function deleteUser(id){db.users=db.users.filter((x)=>x.id!==id); saveDB(); activateMenu('pengaturan');}

window.editClient=editClient; window.deleteClient=deleteClient; window.editWorker=editWorker; window.deleteWorker=deleteWorker; window.deletePayroll=deletePayroll; window.editUser=editUser; window.deleteUser=deleteUser;

document.getElementById('loginForm').addEventListener('submit',(e)=>{e.preventDefault(); el('loginView').classList.add('hidden'); el('dashboardView').classList.remove('hidden'); activateMenu('dashboard');});
document.getElementById('logoutBtn').addEventListener('click',()=>{el('dashboardView').classList.add('hidden'); el('loginView').classList.remove('hidden');});
document.getElementById('sidebarMenu').addEventListener('click',(e)=>{const btn=e.target.closest('.menu-item'); if(btn) activateMenu(btn.dataset.menu);});

renderMenu();
