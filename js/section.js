const urlParams = new URLSearchParams(window.location.search);
const pageSlug = urlParams.get('page') || 'amv-editing';

// Format human headings from url parameter slugs safely
const titlesMap = {
    'amv-editing': 'AMV Editing Matrix',
    'tiktok-style': 'TikTok & Shorts Style',
    'professional': 'Professional Presets'
};
document.getElementById('directory-title').innerText = titlesMap[pageSlug] || 'Asset Directory';

async function fetchSectionManifest() {
    const { data: uploads, error } = await supabaseClient
        .from('uploads')
        .select('*')
        .eq('collection_id', pageSlug)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    const grid = document.getElementById('assets-display-grid');
    const placeholder = document.getElementById('empty-directory-placeholder');

    if (error || !uploads || uploads.length === 0) {
        grid.innerHTML = '';
        placeholder.classList.remove('hidden');
        return;
    }

    placeholder.classList.add('hidden');
    grid.innerHTML = uploads.map(item => `
        <div onclick="window.location.href='asset.html?id=${item.id}'" class="module-card overflow-hidden cursor-pointer flex flex-col justify-between group">
            <div class="relative aspect-video w-full bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                ${item.preview_video_url ? `
                    <video src="${item.preview_video_url}" muted loop playsinline autoplay class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"></video>
                ` : `
                    <span class="text-[10px] font-bold text-sky-400/60 tracking-wider uppercase">${item.type} Asset</span>
                `}
                <span class="absolute top-3 left-3 bg-sky-500 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">${item.type}</span>
            </div>
            <div class="p-5 space-y-2">
                <h3 class="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition truncate">${item.title}</h3>
                <div class="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>${new Date(item.created_at).toLocaleDateString()}</span>
                    <span class="text-sky-500 font-bold">${item.views_count || 0} views</span>
                </div>
            </div>
        </div>
    `).join('');
}

fetchSectionManifest();
