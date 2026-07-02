// Verification Subscriptions
document.getElementById('auth-submit-btn').addEventListener('click', () => {
    const keyInput = document.getElementById('gate-key-input').value;
    verifyAdminLock(keyInput);
});

// Setup input listeners to allow hitting 'Enter' to submit smoothly
document.getElementById('gate-key-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyAdminLock(e.target.value);
    }
});

// Form Processing Submissions Pipeline
document.getElementById('upload-panel-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const assetPayload = {
        title: document.getElementById('asset-title-field').value,
        collection_id: document.getElementById('asset-module-field').value, // Maps directly to page slug routing
        type: document.getElementById('asset-type-field').value.toUpperCase(),
        download_url: document.getElementById('asset-download-field').value,
        preview_video_url: document.getElementById('asset-preview-field').value || null,
        status: 'published',
        views_count: 0,
        created_at: new Date().toISOString()
    };

    const { error } = await supabaseClient.from('uploads').insert([assetPayload]);

    if (error) {
        alert("Transmission breakdown: " + error.message);
    } else {
        alert("Component successfully synced to live servers!");
        document.getElementById('upload-panel-form').reset();
        loadAdminDashboardData();
    }
});

// Load Live Database Information onto Layout
async function loadAdminDashboardData() {
    const { data: records, error } = await supabaseClient
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Critical manifest load error:", error);
        return;
    }

    const container = document.getElementById('admin-manifest-rows');
    if (!records || records.length === 0) {
        container.innerHTML = `<tr><td colspan="3" class="py-8 text-center text-slate-400 font-medium">No live components deployed.</td></tr>`;
        return;
    }

    container.innerHTML = records.map(row => `
        <tr class="hover:bg-slate-50/50 transition-colors">
            <td class="py-4 font-bold text-slate-900">
                <div>${row.title}</div>
                <div class="text-[10px] text-sky-500 font-medium uppercase tracking-wide mt-0.5">${row.collection_id}</div>
            </td>
            <td class="py-4"><span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-slate-200">${row.type}</span></td>
            <td class="py-4 text-right">
                <button onclick="purgeComponent('${row.id}')" class="text-rose-500 hover:text-rose-600 font-bold tracking-wider transition bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg">DELETE</button>
            </td>
        </tr>
    `).join('');
}

// Data Purging Pipeline Logic
async function purgeComponent(targetId) {
    if (confirm("Are you absolutely certain you want to purge this asset container from servers?")) {
        const { error } = await supabaseClient.from('uploads').delete().eq('id', targetId);
        if (error) {
            alert("Execution fault: " + error.message);
        } else {
            alert("Asset removed successfully.");
            loadAdminDashboardData();
        }
    }
}