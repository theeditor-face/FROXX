const queryParams = new URLSearchParams(window.location.search);
const targetAssetId = queryParams.get('id');

let downloadRedirectUrl = "#";

if (!targetAssetId) {
    window.location.href = 'index.html';
}

async function loadAssetRecordDetails() {
    const { data: item, error } = await supabaseClient
        .from('uploads')
        .select('*')
        .eq('id', targetAssetId)
        .single();

    if (error || !item) {
        window.location.href = 'index.html';
        return;
    }

    downloadRedirectUrl = item.download_url;

    // Populates fields completely independent of main templates structure
    document.getElementById('asset-display-title').innerText = item.title;
    document.getElementById('asset-type-badge').innerText = item.type;
    document.getElementById('asset-timestamp').innerText = new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('asset-counter').innerText = `${item.views_count || 0} views`;

    const videoFrame = document.getElementById('preview-window-frame');
    if (item.preview_video_url) {
        videoFrame.innerHTML = `<video src="${item.preview_video_url}" controls autoplay loop playsinline class="w-full h-full object-cover max-h-[60vh]"></video>`;
    } else {
        videoFrame.innerHTML = `
            <div class="text-center p-6 space-y-2">
                <div class="text-3xl text-slate-300">🎬</div>
                <div class="text-[10px] tracking-widest font-bold text-slate-400 uppercase">No Media Preview Sync Available</div>
            </div>
        `;
    }

    // Instantly renders sync qr maps using encoded context address strings
    const encodedAddress = encodeURIComponent(window.location.href);
    document.getElementById('companion-qr-matrix').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedAddress}&color=1E293B`;
}

function executeDownloadRequest() {
    window.open(downloadRedirectUrl, '_blank');
    supabaseClient.rpc('increment_asset_views', { asset_row_id: targetAssetId }).catch(() => {
        // Asynchronous structural patch function logic manually if rpc modules are unmapped
        const count = parseInt(document.getElementById('asset-counter').innerText) || 0;
        supabaseClient.from('uploads').update({ views_count: count + 1 }).eq('id', targetAssetId);
    });
}

function copyCurrentAssetUrl() {
    navigator.clipboard.writeText(window.location.href);
    const textNode = document.getElementById('clipboard-btn-text');
    textNode.innerText = "Copied to Clipboard!";
    textNode.classList.add("text-sky-500");
    setTimeout(() => {
        textNode.innerText = "Copy Configuration Link";
        textNode.classList.remove("text-sky-500");
    }, 2000);
}

loadAssetRecordDetails();