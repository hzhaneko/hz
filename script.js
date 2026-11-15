// ==========================================================================
// Haneko Space - Interactive Logic & Google Gemini API Integration
// ==========================================================================

const DEFAULT_KEY = "AQ.Ab8RN6L7T_Glv7x527mcvqsVHP_L7aUB96nMhUogNsOnAYl3HA";

// Always sync with the latest valid key
let activeKey = DEFAULT_KEY;
localStorage.setItem("GEMINI_USER_KEY", DEFAULT_KEY);

// Cached working endpoint config: { ver, model } (Only set on SUCCESSFUL reply!)
let verifiedEndpoint = null;

// Conversation memory for continuous multi-turn chat
let conversationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    // Modal Elements
    const modalAbout = document.getElementById("myModal");
    const modalEmail = document.getElementById("emailModal");

    // Buttons
    const btnAbout = document.getElementById("openAboutModalBtn");
    const btnSidebarAbout = document.getElementById("sidebarAboutBtn");
    const sidebarSetupBtn = document.getElementById("sidebarSetupBtn");
    const navAbout = document.getElementById("navAbout");
    const navSetup = document.getElementById("navSetup");
    const contactBtn = document.getElementById("contactBtn");
    const tryMeBtn = document.getElementById("tryMeBtn");
    const openEmailCardBtn = document.getElementById("openEmailCardBtn");

    // Ecosystem Cards
    const cachyCard = document.getElementById("cachyCard");
    const termCard = document.getElementById("termCard");
    const codeCard = document.getElementById("codeCard");
    const gameCard = document.getElementById("gameCard");

    const closeButtons = document.querySelectorAll(".close-button, .close-email-button");
    const modalBackdrops = document.querySelectorAll(".modal-backdrop");

    // Clipboard copy
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    const copyFeedback = document.getElementById("copyFeedback");
    const emailToCopy = document.getElementById("emailToCopy");

    // Interactive Terminal / Mockup Elements
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const mockNewSessionBtn = document.getElementById("mockNewSessionBtn");

    // Open Modal Helper
    const openModal = (targetModal) => {
        if (!targetModal) return;
        targetModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    // Close Modal Helper
    const closeModal = () => {
        if (modalAbout) modalAbout.classList.remove("active");
        if (modalEmail) modalEmail.classList.remove("active");
        document.body.style.overflow = "";
    };

    // Event Listeners for Opening Modals
    if (btnAbout) btnAbout.addEventListener('click', () => openModal(modalAbout));
    if (btnSidebarAbout) btnSidebarAbout.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalAbout);
    });
    if (navAbout) navAbout.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalAbout);
    });

    if (contactBtn) contactBtn.addEventListener('click', () => openModal(modalEmail));
    if (openEmailCardBtn) openEmailCardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalEmail);
    });

    // Close Modal Listeners
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    modalBackdrops.forEach(backdrop => backdrop.addEventListener('click', closeModal));

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeModal();
    });

    // Copy Email to Clipboard
    if (copyEmailBtn && emailToCopy) {
        copyEmailBtn.addEventListener('click', () => {
            const text = emailToCopy.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                copyFeedback.textContent = "Copied!";
                copyEmailBtn.style.color = "#a6e3a1";
                setTimeout(() => {
                    copyFeedback.textContent = "Copy";
                    copyEmailBtn.style.color = "";
                }, 2000);
            }).catch(() => {
                const temp = document.createElement("input");
                temp.value = text;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand("copy");
                document.body.removeChild(temp);
                copyFeedback.textContent = "Copied!";
                setTimeout(() => copyFeedback.textContent = "Copy", 2000);
            });
        });
    }

    // Scroll to Chat / Try Me
    if (tryMeBtn) {
        tryMeBtn.addEventListener('click', () => {
            chatInput.focus();
            chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function appendUserMessage(text) {
        const userDiv = document.createElement("div");
        userDiv.className = "chat-bubble chat-bubble--user";
        userDiv.textContent = text;
        chatMessages.appendChild(userDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendAssistantMessage(htmlContent) {
        const assistantDiv = document.createElement("div");
        assistantDiv.className = "chat-bubble chat-bubble--assistant";
        assistantDiv.innerHTML = htmlContent;
        chatMessages.appendChild(assistantDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return assistantDiv;
    }

    function renderSpecs() {
        appendAssistantMessage(`
            <div class="terminal-banner">
                <i class="fa-solid fa-cat"></i>
                <span>I Miss Her | Vanii&lt;3</span>
            </div>
            <div class="system-summary">
                <div class="summary-line"><span class="label">OS:</span> CachyOS Linux</div>
                <div class="summary-line"><span class="label">Host:</span> HP Laptop 14-em0xxx</div>
                <div class="summary-line"><span class="label">Kernel:</span> 7.3.0-4-cachyos</div>
                <div class="summary-line"><span class="label">Packages:</span> 1579 (pacman)</div>
                <div class="summary-line"><span class="label">User:</span> h4n3k0_0 @ Jettpc</div>
                <div class="summary-line"><span class="label">WM:</span> Hyprland</div>
                <div class="summary-line"><span class="label">Cursor:</span> Bibata-Modern-Classic</div>
                <div class="summary-line"><span class="label">Shell:</span> fish 4.9.3</div>
                <div class="summary-line"><span class="label">Terminal:</span> foot</div>
                <div class="summary-line"><span class="label">CPU:</span> AMD Ryzen 5 7520U @ 4.39 GHz</div>
                <div class="summary-line"><span class="label">GPU:</span> AMD AMD Radeon 610M @ amdgpu</div>
                <div class="summary-line"><span class="label">Game:</span> Valorant</div>
            </div>
        `);
    }

    // Ecosystem Card Click Interactions
    if (cachyCard) {
        cachyCard.addEventListener('click', () => {
            appendUserMessage("fastfetch --os");
            setTimeout(renderSpecs, 250);
        });
    }

    if (termCard) {
        termCard.addEventListener('click', () => {
            appendUserMessage("echo $TERM / $SHELL");
            setTimeout(() => {
                appendAssistantMessage(`
                    <div class="system-summary">
                        <div class="summary-line"><span class="label">Terminal:</span> foot (Wayland)</div>
                        <div class="summary-line"><span class="label">Shell:</span> fish 4.9.3</div>
                        <div class="summary-line"><span class="label">Prompt:</span> powerline styled</div>
                    </div>
                `);
            }, 250);
        });
    }

    if (gameCard) {
        gameCard.addEventListener('click', () => {
            appendUserMessage("games --info");
            setTimeout(() => {
                appendAssistantMessage(`
                    <div class="system-summary">
                        <div class="summary-line"><span class="label">Game:</span> Valorant</div>
                        <div class="summary-line"><span class="label">Agent:</span> Jett</div>
                        <div class="summary-line"><span class="label">Vibe:</span> Competitive & Chill</div>
                    </div>
                `);
            }, 250);
        });
    }

    if (codeCard) {
        codeCard.addEventListener('click', () => {
            appendUserMessage("ls ~/.config/hypr");
            setTimeout(() => {
                appendAssistantMessage(`
                    <div class="system-summary">
                        <div class="summary-line"><span class="label">Config:</span> hyprland.conf, waybar, foot.ini, fish</div>
                        <div class="summary-line"><span class="label">Compositor:</span> Hyprland (Wayland)</div>
                    </div>
                `);
            }, 250);
        });
    }

    if (sidebarSetupBtn) {
        sidebarSetupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appendUserMessage("cat specs.txt");
            setTimeout(renderSpecs, 250);
        });
    }

    if (navSetup) {
        navSetup.addEventListener('click', (e) => {
            e.preventDefault();
            appendUserMessage("show CachyOS setup");
            setTimeout(renderSpecs, 250);
            chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Helper: fetch with strict timeout
    function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(timer));
    }

    // Call Google Gemini API
    async function askGemini(promptText, statusCallback) {
        // If we already have a verified working endpoint, use it directly!
        let candidateList = [];

        if (verifiedEndpoint) {
            candidateList.push(verifiedEndpoint);
        }

        // Add current active Gemini models (Gemini 3.8 Flash, 3.5 Flash, 2.0 Flash, 1.5 Flash)
        const modernModels = [
            "gemini-3.8-flash",
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-8b",
            "gemini-2.0-flash-exp",
            "gemini-2.5-flash"
        ];

        for (const mod of modernModels) {
            candidateList.push({ ver: "v1beta", model: mod });
            candidateList.push({ ver: "v1",     model: mod });
        }

        // Deduplicate
        const seen = new Set();
        const candidates = candidateList.filter(item => {
            const key = `${item.ver}/${item.model}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        const systemNote = "You are Haneko (ThanhHai / Jett). You run CachyOS Linux, Hyprland, foot terminal, fish shell on HP Laptop, and play Valorant. Answer concisely and chill in the user's language.";

        const requestPayload = {
            contents: [
                ...conversationHistory,
                {
                    role: "user",
                    parts: [{ text: `${promptText}\n\n[Instruction: ${systemNote}]` }]
                }
            ]
        };

        let lastError = null;

        for (const item of candidates) {
            if (statusCallback) statusCallback(`Connecting to ${item.model}...`);
            const url = `https://generativelanguage.googleapis.com/${item.ver}/models/${item.model}:generateContent?key=${encodeURIComponent(activeKey)}`;

            try {
                const response = await fetchWithTimeout(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestPayload)
                }, 4000);

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        // VERIFIED WORKING! Lock to this endpoint for all future messages!
                        verifiedEndpoint = item;
                        console.log(`Connected successfully using ${item.ver}/${item.model}!`);
                        
                        conversationHistory.push({ role: "user", parts: [{ text: promptText }] });
                        conversationHistory.push({ role: "model", parts: [{ text }] });
                        if (conversationHistory.length > 20) {
                            conversationHistory = conversationHistory.slice(-20);
                        }
                        return text;
                    }
                } else {
                    const errJson = await response.json().catch(() => ({}));
                    const errMsg = errJson.error?.message || `HTTP ${response.status}: ${response.statusText}`;
                    lastError = new Error(`[${item.ver}/${item.model}] ${errMsg}`);
                    console.warn(`Model ${item.model} returned error, skipping:`, errMsg);
                    // Continue to next candidate!
                }
            } catch (err) {
                if (err.name === 'AbortError') {
                    lastError = new Error(`[${item.model}] Timeout (> 4s).`);
                } else {
                    lastError = err;
                }
                console.warn(`Model ${item.model} exception, skipping:`, err);
            }
        }

        if (verifiedEndpoint) verifiedEndpoint = null;
        throw lastError || new Error("Không thể kết nối đến máy chủ Google Gemini.");
    }

    // Markdown Formatter for AI response
    function formatMarkdown(text) {
        if (!text) return "";
        let html = escapeHTML(text);
        // Code blocks ```code```
        html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, '<pre><code>$2</code></pre>');
        // Inline code `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Bold **text**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Italic *text*
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Bullet points
        html = html.replace(/^\s*[-*]\s+(.*)$/gim, '• $1<br/>');
        // Paragraphs
        html = html.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>');
        return `<p>${html}</p>`;
    }

    // Chat form submit
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendUserMessage(text);
            chatInput.value = "";

            const lower = text.toLowerCase();

            // Built-in shortcut commands
            if (lower === "clear") {
                conversationHistory = [];
                verifiedEndpoint = null;
                chatMessages.innerHTML = "";
                appendAssistantMessage("<p>Terminal cleared. Memory reset. Ask Gemini AI anything or type <code>specs</code>.</p>");
                return;
            }

            if (lower === "specs" || lower === "fastfetch") {
                renderSpecs();
                return;
            }

            // Command to dynamically update API key right from chat:
            if (lower.startsWith("/key ") || lower.startsWith("key ")) {
                const parts = text.split(" ");
                const newKey = parts[1]?.trim();
                if (newKey) {
                    activeKey = newKey;
                    localStorage.setItem("GEMINI_USER_KEY", newKey);
                    verifiedEndpoint = null;
                    appendAssistantMessage(`
                        <p style="color: #a6e3a1;">
                            <i class="fa-solid fa-circle-check"></i>
                            Đã cập nhật API Key mới: <code>${newKey.substring(0, 10)}...</code>
                        </p>
                        <p>Bây giờ bạn có thể gõ câu hỏi để trò chuyện!</p>
                    `);
                    return;
                }
            }

            // Show thinking indicator
            const thinkingEl = appendAssistantMessage(`
                <div class="thinking-bubble">
                    <span class="ring-loader"></span>
                    <span id="thinkingStatusText">Gemini is thinking...</span>
                </div>
            `);

            const updateStatus = (statusStr) => {
                const statusSpan = document.getElementById("thinkingStatusText");
                if (statusSpan) statusSpan.textContent = statusStr;
            };

            try {
                const reply = await askGemini(text, updateStatus);
                thinkingEl.innerHTML = formatMarkdown(reply);
            } catch (err) {
                console.error("Gemini API Error:", err);
                const testLink = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(activeKey)}`;
                thinkingEl.innerHTML = `
                    <div style="color: #f38ba8; margin-bottom: 6px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <strong>Gemini API Error:</strong> ${escapeHTML(err.message)}
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); line-height: 1.6;">
                        • Mở link kiểm tra model được cấp phép: <a href="${testLink}" target="_blank" style="color: #89b4fa; text-decoration: underline;">Xem danh sách model của Key</a><br/>
                        • Đổi key mới bằng lệnh: <code>/key &lt;mã_key_mới&gt;</code>
                    </div>
                `;
            }
        });
    }

    // Mock New Session
    if (mockNewSessionBtn) {
        mockNewSessionBtn.addEventListener('click', () => {
            conversationHistory = [];
            verifiedEndpoint = null;
            chatMessages.innerHTML = "";
            appendAssistantMessage(`
                <p>Started a fresh session in <strong>h4n3k0_0 @ Jettpc</strong> (fish 4.9.3).</p>
                <div class="diff-tag">
                    <span>Gemini AI Connected ✦ • Ready for new tasks</span>
                </div>
            `);
        });
    }

    // Sidebar items click
    const subitems = document.querySelectorAll(".sidebar-subitem");
    subitems.forEach(item => {
        item.addEventListener('click', () => {
            subitems.forEach(s => s.classList.remove("active-file"));
            item.classList.add("active-file");
            const filename = item.dataset.file || item.querySelector("span:last-child")?.textContent || "file";
            appendUserMessage(`cat ${filename}`);
            setTimeout(() => {
                if (filename === "specs_fetch.sh") {
                    renderSpecs();
                } else if (filename === "foot.ini") {
                    appendAssistantMessage(`
                        <div class="system-summary">
                            <div># ~/.config/foot/foot.ini</div>
                            <div>font=JetBrains Mono:size=11</div>
                            <div>pad=12x12</div>
                        </div>
                    `);
                } else if (filename === "valorant-settings") {
                    appendAssistantMessage(`
                        <div class="system-summary">
                            <div># Valorant Profile</div>
                            <div>Favorite Agent: Jett</div>
                            <div>Mode: Competitive / Chill</div>
                        </div>
                    `);
                } else {
                    appendAssistantMessage(`
                        <div class="system-summary">
                            <div># Viewing <code>${filename}</code></div>
                            <div>Status: Clean, verified on CachyOS Linux.</div>
                        </div>
                    `);
                }
            }, 250);
        });
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
