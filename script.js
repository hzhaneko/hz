// ==========================================================================
// Haneko Space - Interactive Logic & Google Gemini API Integration
// ==========================================================================

const GEMINI_API_KEY = "AQ.Ab8RN6LjxIfeclkYPBr4EnFcp2-A_P-VSUWLHST-M_7NbG4d_g";

// Cached working endpoint
let cachedModelEndpoint = null;

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
                copyEmailBtn.style.color = "#4ade80";
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

    // Automatically discover available working Gemini model
    async function resolveWorkingEndpoint() {
        if (cachedModelEndpoint) return cachedModelEndpoint;

        // Step 1: Query ListModels dynamically from Google API
        const versions = ["v1beta", "v1"];
        for (const ver of versions) {
            try {
                const listUrl = `https://generativelanguage.googleapis.com/${ver}/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
                const res = await fetch(listUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data.models && Array.isArray(data.models) && data.models.length > 0) {
                        const supported = data.models.filter(m => 
                            m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
                        );
                        if (supported.length > 0) {
                            // Find best match: 1.5-flash-latest, 1.5-flash, 2.0-flash, pro, etc.
                            const best = supported.find(m => m.name.includes("1.5-flash-latest")) ||
                                         supported.find(m => m.name.includes("1.5-flash")) ||
                                         supported.find(m => m.name.includes("2.0-flash")) ||
                                         supported.find(m => m.name.includes("flash")) ||
                                         supported.find(m => m.name.includes("gemini")) ||
                                         supported[0];
                            const cleanName = best.name.startsWith("models/") ? best.name.replace("models/", "") : best.name;
                            cachedModelEndpoint = {
                                version: ver,
                                modelName: cleanName,
                                url: `https://generativelanguage.googleapis.com/${ver}/models/${cleanName}:generateContent`
                            };
                            return cachedModelEndpoint;
                        }
                    }
                }
            } catch (err) {
                console.warn(`ListModels error on ${ver}:`, err);
            }
        }

        // Step 2: Fallback candidates
        const fallbacks = [
            { ver: "v1beta", model: "gemini-1.5-flash-latest" },
            { ver: "v1beta", model: "gemini-2.0-flash" },
            { ver: "v1beta", model: "gemini-2.0-flash-exp" },
            { ver: "v1", model: "gemini-1.5-flash" },
            { ver: "v1beta", model: "gemini-pro" }
        ];

        return {
            ver: "v1beta",
            model: "gemini-1.5-flash-latest",
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`
        };
    }

    // Call Google Gemini API
    async function askGemini(promptText) {
        const endpoint = await resolveWorkingEndpoint();

        // Universal persona setup compatible with all Gemini versions (v1 and v1beta)
        const contents = [
            {
                role: "user",
                parts: [{ 
                    text: `[System Instructions: You are Haneko (real name ThanhHai, nicknamed Jett / TTHaii). 
You are a secondary school student passionate about IT, science, CachyOS Linux (Kernel 7.3.0-4-cachyos, foot terminal, fish 4.9.3 shell, Hyprland on HP Laptop 14-em0xxx with AMD Ryzen 5 7520U and AMD Radeon 610M), and playing Valorant. 
Answer concisely, in a chill and friendly persona. Respond in the same language as the user (Vietnamese or English).]` 
                }]
            },
            {
                role: "model",
                parts: [{ text: "Got it! I am Haneko. I am ready to chill and chat with you." }]
            },
            ...conversationHistory,
            {
                role: "user",
                parts: [{ text: promptText }]
            }
        ];

        // Try primary endpoint
        let candidateUrls = [
            endpoint.url,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
        ];

        // Deduplicate URLs
        candidateUrls = [...new Set(candidateUrls)];

        let lastError = null;

        for (const url of candidateUrls) {
            try {
                const response = await fetch(`${url}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ contents })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        // Cache this successful URL
                        cachedModelEndpoint = { url };
                        // Save conversation memory
                        conversationHistory.push({ role: "user", parts: [{ text: promptText }] });
                        conversationHistory.push({ role: "model", parts: [{ text }] });
                        if (conversationHistory.length > 20) {
                            conversationHistory = conversationHistory.slice(-20);
                        }
                        return text;
                    }
                } else {
                    const errJson = await response.json().catch(() => ({}));
                    lastError = new Error(errJson.error?.message || `HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (err) {
                lastError = err;
            }
        }

        throw lastError || new Error("Không thể kết nối đến Gemini API.");
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
                chatMessages.innerHTML = "";
                appendAssistantMessage("<p>Terminal cleared. Memory reset. Ask Gemini AI anything or type <code>specs</code>.</p>");
                return;
            }

            if (lower === "specs" || lower === "fastfetch") {
                renderSpecs();
                return;
            }

            // Show thinking indicator
            const thinkingEl = appendAssistantMessage(`
                <div class="thinking-bubble">
                    <span class="ring-loader"></span>
                    <span>Gemini is thinking...</span>
                </div>
            `);

            try {
                const reply = await askGemini(text);
                thinkingEl.innerHTML = formatMarkdown(reply);
            } catch (err) {
                console.error("Gemini API Error:", err);
                thinkingEl.innerHTML = `
                    <div style="color: #f87171;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <strong>Gemini API Error:</strong> ${escapeHTML(err.message)}
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px;">
                        Kiểm tra lại kết nối mạng hoặc tính hợp lệ của API Key.
                    </div>
                `;
            }
        });
    }

    // Mock New Session
    if (mockNewSessionBtn) {
        mockNewSessionBtn.addEventListener('click', () => {
            conversationHistory = [];
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
