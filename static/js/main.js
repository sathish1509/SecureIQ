/**
 * SecureIQ - Phishing URL Detector Frontend Logic
 * Handles fetch POST /analyze, UI state transitions, and tabular signal rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const scanForm = document.getElementById('url-scan-form');
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const formError = document.getElementById('form-error');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    // Results Elements
    const resultsSection = document.getElementById('results-section');
    const resScoreNum = document.getElementById('res-score-num');
    const resScoreBar = document.getElementById('res-score-bar');
    const resVerdictBadge = document.getElementById('res-verdict-badge');
    const resVerdictDesc = document.getElementById('res-verdict-desc');
    const resTimestamp = document.getElementById('res-timestamp');
    const resTargetUrl = document.getElementById('res-target-url');
    const resHostDomain = document.getElementById('res-host-domain');
    const resProtocol = document.getElementById('res-protocol');
    const resIpDetection = document.getElementById('res-ip-detection');
    const resSignalsCount = document.getElementById('res-signals-count');
    const resSignalsTbody = document.getElementById('res-signals-tbody');

    // Quick Sample URLs Click Handler
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleUrl = btn.getAttribute('data-url');
            if (sampleUrl) {
                urlInput.value = sampleUrl;
                urlInput.focus();
                clearError();
                executeUrlScan(sampleUrl);
            }
        });
    });

    // Form Submit Handler
    scanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetUrl = urlInput.value.trim();
        
        if (!targetUrl) {
            showError('Please enter a valid URL to analyze.');
            return;
        }

        clearError();
        executeUrlScan(targetUrl);
    });

    /**
     * Executes the POST /analyze API call
     */
    async function executeUrlScan(url) {
        setLoadingState(true);

        try {
            const fetchPromise = fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            }).then(async res => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || `Server responded with status ${res.status}`);
                }
                return res.json();
            });

            let data;
            if (typeof window.runScanWithSteps === 'function') {
                data = await window.runScanWithSteps(url, fetchPromise);
            } else {
                data = await fetchPromise;
            }

            renderResults(data);
        } catch (err) {
            showError(err.message || 'Network error occurred while analyzing the URL.');
        } finally {
            setLoadingState(false);
        }
    }

    /**
     * Toggles form loading state during fetch execution
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            urlInput.disabled = true;
            btnText.textContent = 'Analyzing...';
        } else {
            submitBtn.disabled = false;
            urlInput.disabled = false;
            btnText.textContent = 'Analyze URL';
        }
    }

    /**
     * Displays form validation error message
     */
    function showError(msg) {
        formError.textContent = msg;
        formError.classList.remove('hidden');
    }

    /**
     * Clears error display
     */
    function clearError() {
        formError.textContent = '';
        formError.classList.add('hidden');
    }

    /**
     * Renders returned analysis JSON into the results UI
     */
    function renderResults(data) {
        // 1. Unhide results section
        resultsSection.classList.remove('hidden');

        // 2. Score Readout & Meter Bar
        const score = data.risk_score || 0;
        resScoreNum.textContent = score;
        resScoreBar.style.width = `${score}%`;
        
        // Remove existing meter color classes
        resScoreBar.classList.remove('meter-safe', 'meter-warning', 'meter-danger');
        
        if (score >= 70) {
            resScoreBar.classList.add('meter-danger');
        } else if (score >= 40) {
            resScoreBar.classList.add('meter-warning');
        } else {
            resScoreBar.classList.add('meter-safe');
        }

        // 3. Verdict Badge & Summary
        resVerdictBadge.textContent = data.verdict || 'Unknown';
        resVerdictBadge.className = 'verdict-badge'; // reset

        if (data.verdict_level === 'danger') {
            resVerdictBadge.classList.add('badge-danger');
            resVerdictDesc.textContent = 'High probability of phishing or malicious credential harvesting attempt.';
        } else if (data.verdict_level === 'warning') {
            resVerdictBadge.classList.add('badge-warning');
            resVerdictDesc.textContent = 'Suspicious domain traits detected. Exercise caution before entering credentials.';
        } else {
            resVerdictBadge.classList.add('badge-safe');
            resVerdictDesc.textContent = 'Target displays low risk characteristics. No overt phishing indicators found.';
        }

        // 4. Metadata Grid
        resTimestamp.textContent = data.analyzed_at || '--';
        resTargetUrl.textContent = data.url || '--';
        resHostDomain.textContent = data.domain || '--';
        resProtocol.textContent = data.protocol || '--';
        resIpDetection.textContent = data.ip_detected || '--';

        // 5. Signals Table Rendering
        const signals = data.signals || [];
        resSignalsCount.textContent = `${signals.length} Signal${signals.length === 1 ? '' : 's'} Identified`;
        resSignalsTbody.innerHTML = '';

        if (signals.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-muted);">No suspicious signals detected.</td>`;
            resSignalsTbody.appendChild(tr);
        } else {
            signals.forEach(sig => {
                const tr = document.createElement('tr');
                
                // Map risk level to tag class
                let riskClass = 'risk-low';
                if (sig.risk === 'high') riskClass = 'risk-high';
                else if (sig.risk === 'medium') riskClass = 'risk-medium';
                else if (sig.risk === 'safe') riskClass = 'risk-safe';

                tr.innerHTML = `
                    <td class="signal-name">${escapeHtml(sig.title)}</td>
                    <td class="category-tag">${escapeHtml(sig.category)}</td>
                    <td><span class="risk-tag ${riskClass}">${escapeHtml(sig.risk)}</span></td>
                    <td>${escapeHtml(sig.description)}</td>
                `;
                resSignalsTbody.appendChild(tr);
            });
        }

        // 6. Smooth scroll down to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Simple HTML sanitizer
     */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
