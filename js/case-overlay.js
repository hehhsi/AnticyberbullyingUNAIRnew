/* =========================================
   CASE STORY OVERLAY - JavaScript
   ========================================= */

// Case Data
const casesData = {
    "amanda-todd": {
        name: "Amanda Todd",
        meta: "Canada, 2012 • 15 Tahun",
        emoji: "🇨🇦",
        timeline: [
            { date: "2010", event: "Dipaksa oleh predator online untuk mengirimkan foto diri." },
            { date: "2011", event: "Foto tersebar ke teman-teman sekolah. Mulai mengalami bullying parah." },
            { date: "2012", event: "Pindah sekolah berkali-kali, namun pelaku terus mengikuti dan menyebarkan foto." },
            { date: "Sept 2012", event: "Mengunggah video flashcard di YouTube menceritakan kisahnya." },
            { date: "10 Okt 2012", event: "Amanda mengakhiri hidupnya di usia 15 tahun." }
        ],
        sources: [
            { title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Suicide_of_Amanda_Todd" },
            { title: "CBC News", url: "https://www.cbc.ca/news/canada/amanda-todd" }
        ]
    },
    "ajeng": {
        name: "Ajeng",
        meta: "Sukabumi, 2025 • 14 Tahun",
        emoji: "🇮🇩",
        timeline: [
            { date: "Awal 2025", event: "Mulai mengalami perundungan dari teman-teman sekolah." },
            { date: "Pertengahan 2025", event: "Tekanan semakin berat, tidak ada yang membantu." },
            { date: "Akhir 2025", event: "Meninggalkan surat wasiat yang memilukan." },
            { date: "2025", event: "Ajeng mengakhiri hidupnya di usia 14 tahun." }
        ],
        sources: [
            { title: "Detik News", url: "https://www.detik.com" },
            { title: "Kompas", url: "https://www.kompas.com" }
        ]
    },
    "aulia-risma": {
        name: "Dr. Aulia Risma",
        meta: "Semarang, 2024 • Mahasiswi Kedokteran",
        emoji: "🏥",
        timeline: [
            { date: "2023", event: "Menjalani pendidikan kedokteran di universitas ternama." },
            { date: "2024", event: "Mengalami tekanan dan bullying dari senior (senioritas)." },
            { date: "Pertengahan 2024", event: "Tekanan akademik dan perundungan terus berlanjut." },
            { date: "2024", event: "Dr. Aulia Risma mengakhiri hidupnya." }
        ],
        sources: [
            { title: "Tempo", url: "https://www.tempo.co" },
            { title: "Tribun News", url: "https://www.tribunnews.com" }
        ]
    }
};

// Open Overlay
function openCaseOverlay(caseId) {
    const overlay = document.getElementById('caseOverlay');
    const caseData = casesData[caseId];
    if (!caseData || !overlay) return;

    // Populate Header
    document.getElementById('overlayEmoji').textContent = caseData.emoji;
    document.getElementById('overlayName').textContent = caseData.name;
    document.getElementById('overlayMeta').textContent = caseData.meta;

    // Populate Timeline
    const timelineContainer = document.getElementById('overlayTimeline');
    timelineContainer.innerHTML = caseData.timeline.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-event">${item.event}</div>
        </div>
    `).join('');

    // Populate Sources
    const sourcesContainer = document.getElementById('overlaySources');
    sourcesContainer.innerHTML = caseData.sources.map(src => `
        <a href="${src.url}" target="_blank" class="source-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            ${src.title}
        </a>
    `).join('');

    // Show Overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Overlay
function closeCaseOverlay() {
    const overlay = document.getElementById('caseOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('caseOverlay');

    // Attach click listeners to case links
    document.querySelectorAll('.case-link[data-case]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const caseId = link.getAttribute('data-case');
            openCaseOverlay(caseId);
        });
    });

    // Close button
    const closeBtn = document.getElementById('overlayClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCaseOverlay);
    }

    // Click outside to close
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCaseOverlay();
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        const currentOverlay = document.getElementById('caseOverlay');
        if (e.key === 'Escape' && currentOverlay && currentOverlay.classList.contains('active')) {
            closeCaseOverlay();
        }
    });
});
