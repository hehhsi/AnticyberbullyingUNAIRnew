/* =========================================
   DINDING CERITA — STORY WALL LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    // === CONSTANTS ===
    var SW_COLORS = ['#FFF9C4', '#B3E5FC', '#C8E6C9', '#F8BBD0', '#E1BEE7'];
    var SW_PIN_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa'];
    var SW_COLLECTION = 'storywall_notes';
    var SW_MAX_NOTES = 30;
    var SW_MAX_CHARS = 200;
    var SW_RATE_LIMIT_MS = 86400000; // 24 hours
    var SW_BOARD_COLS_DESKTOP = 5;
    var SW_BOARD_ROWS_DESKTOP = 4;
    var SW_BOARD_COLS_MOBILE = 3;
    var SW_BOARD_ROWS_MOBILE = 5;

    var SW_BLOCKED = ['anjing','bangsat','babi','kontol','memek','ngentot','tolol','goblok','bajingan','keparat','brengsek','tai','setan','iblis','bodoh'];

    var SW_PROMPTS = {
        experienced: { label: 'Aku pernah mengalami...', color: '#ef4444', icon: '\u{1F494}' },
        recovery:    { label: 'Yang membantuku bangkit...', color: '#10b981', icon: '\u{1F331}' },
        message:     { label: 'Pesanku untuk kamu...', color: '#3b82f6', icon: '\u{1F48C}' }
    };

    // === GUARD: only run if story-wall section exists ===
    var board = document.getElementById('sw-board');
    if (!board) return;

    // Global zone tracker
    var occupiedZones = new Set();
    var renderedNoteIds = new Set();

    // === ANONYMOUS ID ===
    function getAnonId() {
        var id = localStorage.getItem('sw_anon_id');
        if (!id) {
            id = 'Anon#' + Math.floor(Math.random() * 9000 + 1000);
            localStorage.setItem('sw_anon_id', id);
        }
        return id;
    }

    // === RELATIVE TIME ===
    function getRelativeTime(timestamp) {
        if (!timestamp) return 'Baru saja';
        var date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } else {
            return 'Baru saja';
        }
        var now = new Date();
        var diffMs = now - date;
        var diffMins = Math.floor(diffMs / 60000);
        var diffHours = Math.floor(diffMs / 3600000);
        var diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return diffMins + ' menit lalu';
        if (diffHours < 24) return diffHours + ' jam lalu';
        if (diffDays < 7) return diffDays + ' hari lalu';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' minggu lalu';
        return Math.floor(diffDays / 30) + ' bulan lalu';
    }

    // === BOARD LAYOUT ALGORITHM ===
    function getGridDimensions() {
        if (window.innerWidth <= 768) {
            return { cols: SW_BOARD_COLS_MOBILE, rows: SW_BOARD_ROWS_MOBILE };
        }
        return { cols: SW_BOARD_COLS_DESKTOP, rows: SW_BOARD_ROWS_DESKTOP };
    }

    function getRandomPosition(boardEl, usedZones) {
        var grid = getGridDimensions();
        var totalZones = grid.cols * grid.rows;
        var zoneWidth = 100 / grid.cols;
        var zoneHeight = 100 / grid.rows;

        // Find an unoccupied zone
        var available = [];
        for (var i = 0; i < totalZones; i++) {
            if (!usedZones.has(i)) {
                available.push(i);
            }
        }

        // If all occupied, pick random (wrap around)
        var zoneIndex;
        if (available.length === 0) {
            zoneIndex = Math.floor(Math.random() * totalZones);
        } else {
            zoneIndex = available[Math.floor(Math.random() * available.length)];
        }

        var col = zoneIndex % grid.cols;
        var row = Math.floor(zoneIndex / grid.cols);

        // Center of zone + random offset (±15% of zone size for organic feel)
        var noteSize = window.innerWidth <= 768 ? 72 : 88;
        var boardWidth = boardEl.offsetWidth || 1000;
        var boardHeight = boardEl.offsetHeight || 500;

        var centerX = (col + 0.5) * zoneWidth;
        var centerY = (row + 0.5) * zoneHeight;

        // Random offset ±2% of total
        var offsetX = (Math.random() - 0.5) * (zoneWidth * 0.4);
        var offsetY = (Math.random() - 0.5) * (zoneHeight * 0.4);

        // Clamp so note doesn't go out of bounds
        var notePctW = (noteSize / boardWidth) * 100;
        var notePctH = (noteSize / boardHeight) * 100;

        var posX = Math.max(1, Math.min(100 - notePctW - 1, centerX + offsetX));
        var posY = Math.max(1, Math.min(100 - notePctH - 1, centerY + offsetY));

        usedZones.add(zoneIndex);

        return {
            posX: Math.round(posX * 10) / 10,
            posY: Math.round(posY * 10) / 10,
            zoneIndex: zoneIndex
        };
    }

    // === RENDER NOTE ===
    function renderNote(noteData, boardEl, animate) {
        var note = document.createElement('div');
        note.className = 'sw-note' + (animate ? '' : ' no-animate');
        note.setAttribute('data-note-id', noteData.id || '');
        note.setAttribute('data-color', String(noteData.colorIndex != null ? noteData.colorIndex : Math.floor(Math.random() * 5)));
        note.setAttribute('tabindex', '0');
        note.setAttribute('role', 'button');
        note.setAttribute('aria-label', 'Baca cerita anonim');

        var rotation = noteData.rotation != null ? noteData.rotation : (Math.random() * 10 - 5);
        var rotDeg = rotation + 'deg';
        note.style.setProperty('--note-rotation', rotDeg);

        // Position
        var posX = noteData.posX;
        var posY = noteData.posY;

        // If no stored position, generate new one
        if (posX == null || posY == null) {
            var pos = getRandomPosition(boardEl, occupiedZones);
            posX = pos.posX;
            posY = pos.posY;
        } else {
            // Track zone from stored data
            if (noteData.zoneIndex != null) {
                occupiedZones.add(noteData.zoneIndex);
            }
        }

        note.style.left = posX + '%';
        note.style.top = posY + '%';
        note.style.transform = 'rotate(' + rotDeg + ')';
        note.style.zIndex = noteData.zIndex || (Math.floor(Math.random() * 8) + 1);

        // Pushpin SVG
        var pinColor = SW_PIN_COLORS[Math.floor(Math.random() * SW_PIN_COLORS.length)];
        var pinSvg = '<svg class="sw-pin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
            + '<circle cx="12" cy="8" r="6" fill="' + pinColor + '" />'
            + '<circle cx="12" cy="8" r="3" fill="rgba(255,255,255,0.3)" />'
            + '<rect x="11" y="14" width="2" height="8" rx="1" fill="#888" />'
            + '</svg>';

        // Prompt dot
        var promptType = noteData.promptType || 'message';
        var dotHtml = '<div class="sw-note-dot" data-prompt="' + promptType + '"></div>';

        // Text (truncated)
        var text = noteData.text || '';
        var textHtml = '<div class="sw-note-text">' + escapeHtml(text) + '</div>';

        note.innerHTML = pinSvg + dotHtml + textHtml;

        // Click handler
        note.addEventListener('click', function () {
            openReadModal(noteData);
        });

        // Keyboard handler
        note.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openReadModal(noteData);
            }
        });

        // Track rendered
        if (noteData.id) {
            renderedNoteIds.add(noteData.id);
        }

        return note;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // === HIDE EMPTY STATE ===
    function hideEmptyState() {
        var empty = document.getElementById('sw-empty-state');
        if (empty) empty.classList.add('hidden');
    }

    // === READ MODAL ===
    function openReadModal(noteData) {
        var backdrop = document.getElementById('sw-read-modal');
        if (!backdrop) return;

        var promptInfo = SW_PROMPTS[noteData.promptType] || SW_PROMPTS.message;

        var label = backdrop.querySelector('.sw-read-prompt-label');
        var dot = label.querySelector('.dot');
        var labelText = label.querySelector('.label-text');
        dot.style.background = promptInfo.color;
        labelText.textContent = promptInfo.label;

        backdrop.querySelector('.sw-read-text').textContent = noteData.text;
        backdrop.querySelector('.sw-read-anon').textContent = noteData.anonId || 'Anonim';
        backdrop.querySelector('.sw-read-time').textContent = getRelativeTime(noteData.timestamp);

        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeReadModal() {
        var backdrop = document.getElementById('sw-read-modal');
        if (backdrop) {
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // === WRITE MODAL ===
    function openWriteModal() {
        var lastSubmit = localStorage.getItem('sw_last_submit');
        var rateLimited = lastSubmit && (Date.now() - parseInt(lastSubmit)) < SW_RATE_LIMIT_MS;

        var backdrop = document.getElementById('sw-write-modal');
        if (!backdrop) return;

        var form = backdrop.querySelector('.sw-write-form');
        var rateMsg = backdrop.querySelector('.sw-rate-limit-msg');

        if (rateLimited) {
            form.style.display = 'none';
            rateMsg.style.display = 'block';
            rateMsg.textContent = 'Kamu sudah berbagi hari ini. Kembali besok! \u{1F319}';
        } else {
            form.style.display = 'block';
            rateMsg.style.display = 'none';
            // Reset form
            var textarea = form.querySelector('.sw-textarea');
            textarea.value = '';
            updateCharCounter(textarea);
            form.querySelectorAll('.sw-prompt-option').forEach(function (opt) {
                opt.classList.remove('selected');
            });
            var firstOption = form.querySelector('.sw-prompt-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                var radio = firstOption.querySelector('input');
                if (radio) radio.checked = true;
            }
            var errEl = backdrop.querySelector('.sw-error');
            if (errEl) errEl.textContent = '';
        }

        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeWriteModal() {
        var backdrop = document.getElementById('sw-write-modal');
        if (backdrop) {
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // === CHAR COUNTER ===
    function updateCharCounter(textarea) {
        var wrapper = textarea.closest('.sw-textarea-wrapper');
        var counter = wrapper ? wrapper.querySelector('.sw-char-counter') : null;
        if (!counter) return;
        var remaining = SW_MAX_CHARS - textarea.value.length;
        counter.textContent = remaining + '/' + SW_MAX_CHARS;
        if (remaining < 20) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    // === SPOTLIGHT ANIMATION ===
    function playSpotlight(noteData) {
        if (!board) return;

        // Render note
        var noteEl = renderNote(noteData, board, true);
        board.appendChild(noteEl);
        hideEmptyState();

        // Confirmation text
        var confirmEl = document.createElement('div');
        confirmEl.className = 'sw-spotlight-confirm';
        confirmEl.textContent = 'Ceritamu sudah ditempel \u2713';
        confirmEl.style.left = noteData.posX + '%';
        confirmEl.style.top = (parseFloat(noteData.posY) + 12) + '%';
        confirmEl.style.transform = 'translateX(-50%)';
        board.appendChild(confirmEl);

        // Phase 1: Overlay in
        setTimeout(function () {
            board.classList.add('spotlight-active');
            noteEl.classList.add('spotlight-note');
        }, 100);

        // Phase 4: Fade out
        setTimeout(function () {
            board.classList.remove('spotlight-active');
            noteEl.classList.remove('spotlight-note');
            setTimeout(function () {
                if (confirmEl.parentNode) confirmEl.parentNode.removeChild(confirmEl);
            }, 500);
        }, 2300);
    }

    // === FIREBASE: SUBMIT NOTE ===
    function submitNote(promptType, text) {
        return new Promise(function (resolve, reject) {
            // Rate limit
            var lastSubmit = localStorage.getItem('sw_last_submit');
            if (lastSubmit && (Date.now() - parseInt(lastSubmit)) < SW_RATE_LIMIT_MS) {
                reject({ type: 'rate_limit', message: 'Kamu sudah berbagi hari ini. Kembali besok!' });
                return;
            }

            // Content filter
            var lowerText = text.toLowerCase();
            for (var i = 0; i < SW_BLOCKED.length; i++) {
                if (lowerText.indexOf(SW_BLOCKED[i]) !== -1) {
                    reject({ type: 'filter', message: 'Konten tidak sesuai, coba ungkapkan dengan cara lain.' });
                    return;
                }
            }

            if (typeof db === 'undefined' || typeof firebase === 'undefined') {
                reject({ type: 'error', message: 'Koneksi database belum siap. Coba lagi.' });
                return;
            }

            var pos = getRandomPosition(board, occupiedZones);
            var rotation = parseFloat((Math.random() * 10 - 5).toFixed(1));
            var colorIndex = Math.floor(Math.random() * SW_COLORS.length);
            var zIndex = Math.floor(Math.random() * 8) + 1;

            var noteData = {
                anonId: getAnonId(),
                promptType: promptType,
                text: text.trim(),
                posX: pos.posX,
                posY: pos.posY,
                rotation: rotation,
                colorIndex: colorIndex,
                zIndex: zIndex,
                zoneIndex: pos.zoneIndex,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            db.collection(SW_COLLECTION).add(noteData)
                .then(function (docRef) {
                    localStorage.setItem('sw_last_submit', Date.now().toString());
                    noteData.id = docRef.id;
                    resolve(noteData);
                })
                .catch(function () {
                    reject({ type: 'error', message: 'Gagal mengirim. Coba lagi nanti.' });
                });
        });
    }

    // === FIREBASE: LOAD NOTES ===
    function loadNotes() {
        if (typeof db === 'undefined') {
            console.warn('Story Wall: Firebase not available');
            return;
        }

        try {
            // Initial load
            db.collection(SW_COLLECTION)
                .orderBy('timestamp', 'desc')
                .limit(SW_MAX_NOTES)
                .get()
                .then(function (snapshot) {
                    if (snapshot.empty) return;
                    hideEmptyState();
                    snapshot.forEach(function (doc) {
                        var data = doc.data();
                        data.id = doc.id;
                        if (!renderedNoteIds.has(data.id)) {
                            var noteEl = renderNote(data, board, false);
                            board.appendChild(noteEl);
                        }
                    });
                })
                .catch(function (err) {
                    console.warn('Story Wall: Could not load notes', err);
                });

            // Real-time listener
            db.collection(SW_COLLECTION)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .onSnapshot(function (snapshot) {
                    snapshot.docChanges().forEach(function (change) {
                        if (change.type === 'added') {
                            var data = change.doc.data();
                            data.id = change.doc.id;
                            if (!renderedNoteIds.has(data.id)) {
                                var noteEl = renderNote(data, board, true);
                                board.appendChild(noteEl);
                                hideEmptyState();
                            }
                        }
                    });
                });
        } catch (err) {
            console.warn('Story Wall: Firebase error', err);
        }
    }

    // === EVENT LISTENERS ===

    // Add button
    var addBtn = document.getElementById('sw-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', openWriteModal);
    }

    // Read modal close
    var readModal = document.getElementById('sw-read-modal');
    if (readModal) {
        readModal.addEventListener('click', function (e) {
            if (e.target === readModal) closeReadModal();
        });
    }
    var readClose = document.getElementById('sw-read-close');
    if (readClose) {
        readClose.addEventListener('click', closeReadModal);
    }

    // Write modal close
    var writeModal = document.getElementById('sw-write-modal');
    if (writeModal) {
        writeModal.addEventListener('click', function (e) {
            if (e.target === writeModal) closeWriteModal();
        });
    }
    var writeClose = document.getElementById('sw-write-close');
    if (writeClose) {
        writeClose.addEventListener('click', closeWriteModal);
    }

    // ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeReadModal();
            closeWriteModal();
        }
    });

    // Prompt option selection
    document.querySelectorAll('.sw-prompt-option').forEach(function (option) {
        option.addEventListener('click', function () {
            document.querySelectorAll('.sw-prompt-option').forEach(function (o) {
                o.classList.remove('selected');
            });
            option.classList.add('selected');
            var radio = option.querySelector('input');
            if (radio) radio.checked = true;
        });
    });

    // Textarea char counter
    var swTextarea = document.querySelector('#sw-write-modal .sw-textarea');
    if (swTextarea) {
        swTextarea.addEventListener('input', function () {
            updateCharCounter(swTextarea);
        });
    }

    // Submit button
    var submitBtn = document.getElementById('sw-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            var textarea = document.querySelector('#sw-write-modal .sw-textarea');
            var selectedPrompt = document.querySelector('.sw-prompt-option.selected input');
            var errorEl = document.querySelector('#sw-write-modal .sw-error');

            if (!selectedPrompt) {
                if (errorEl) errorEl.textContent = 'Pilih salah satu prompt.';
                return;
            }

            var text = textarea.value.trim();
            if (!text) {
                if (errorEl) errorEl.textContent = 'Tulis ceritamu terlebih dahulu.';
                return;
            }

            if (text.length > SW_MAX_CHARS) {
                if (errorEl) errorEl.textContent = 'Terlalu panjang. Maksimum ' + SW_MAX_CHARS + ' karakter.';
                return;
            }

            if (errorEl) errorEl.textContent = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menempel...';

            submitNote(selectedPrompt.value, text)
                .then(function (noteData) {
                    closeWriteModal();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Tempel di Papan';
                    // Spotlight reveal
                    setTimeout(function () {
                        playSpotlight(noteData);
                    }, 300);
                })
                .catch(function (err) {
                    if (errorEl) errorEl.textContent = err.message;
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Tempel di Papan';
                });
        });
    }

    // === INIT: Load notes ===
    loadNotes();

});
