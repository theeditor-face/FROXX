let logoClicks = 0;
let logoTimer = null;

// Hidden Door Handler
const secretZone = document.getElementById('secret-logo-zone');
if (secretZone) {
    secretZone.addEventListener('click', () => {
        logoClicks++;
        clearTimeout(logoTimer);
        logoTimer = setTimeout(() => { logoClicks = 0; }, 3000);

        if (logoClicks === 8) {
            logoClicks = 0;
            window.location.href = 'admin.html';
        }
    });
}

// Fixed Password Form Submission Logic
function verifyAdminLock(inputPassword) {
    // Normalizes lowercase string processing to avoid mismatch
    if (inputPassword.trim().toLowerCase() === 'froxxfroxx') {
        alert("Access Granted. Welcome back, FROXX.");
        document.getElementById('auth-gate-panel').classList.add('hidden');
        document.getElementById('admin-workspace-deck').classList.remove('hidden');
        loadAdminDashboardData();
    } else {
        alert("Invalid Security Key Credentials.");
    }
}