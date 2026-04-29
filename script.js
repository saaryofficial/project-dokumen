const loginForm = document.getElementById('loginForm');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
});
