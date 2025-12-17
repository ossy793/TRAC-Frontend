// ============================================
// Main Application Logic
// ============================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 Smart Traffic System initialized');
    console.log('🔗 Backend API:', api.baseUrl);

    // Setup event listeners
    setupTabNavigation();
    setupWalletConnection();
    setupRoutePrediction();
    setupDriverVerification();
    setupDriverRegistration();
    setupFeatureNavigation();

    // Load initial statistics
    loadStatistics();

    // Check backend connection
    checkBackendConnection();
}

/**
 * Check backend connection
 */
async function checkBackendConnection() {
    try {
        const result = await api.healthCheck();
        console.log('✅ Backend connected:', result);
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showToast('Warning: Backend API not responding', 'warning');
    }
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

/**
 * Setup feature card navigation
 */
function setupFeatureNavigation() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetTab = card.dataset.navigate;
            if (targetTab) {
                const tabButton = document.querySelector(`.tab[data-tab="${targetTab}"]`);
                if (tabButton) {
                    tabButton.click();
                }
            }
        });
    });
}

/**
 * Setup wallet connection
 */
function setupWalletConnection() {
    const connectBtn = document.getElementById('connectWallet');

    connectBtn.addEventListener('click', async () => {
        try {
            await web3Manager.connectWallet();
        } catch (error) {
            console.error('Wallet connection failed:', error);
            showToast('Failed to connect wallet', 'error');
        }
    });
}

/**
 * Setup route prediction
 */
function setupRoutePrediction() {
    const analyzeBtn = document.getElementById('analyzeRoute');

    analyzeBtn.addEventListener('click', async () => {
        const startLocation = document.getElementById('startLocation').value.trim();
        const endLocation = document.getElementById('endLocation').value.trim();

        if (!startLocation || !endLocation) {
            showToast('Please enter both locations', 'error');
            return;
        }

        // Show loading
        showLoading('loadingSpinner');
        hideElement('routeResults');

        try {
            const result = await api.predictRoute(startLocation, endLocation);

            if (result.success) {
                displayRouteResults(result.data);
            } else {
                throw new Error(result.error || 'Prediction failed');
            }
        } catch (error) {
            console.error('Route prediction error:', error);
            showToast('Failed to analyze route: ' + error.message, 'error');
        } finally {
            hideLoading('loadingSpinner');
        }
    });
}

/**
 * Display route results
 */
function displayRouteResults(data) {
    const resultsContainer = document.getElementById('routeResults');
    const currentRouteEl = document.getElementById('currentRoute');
    const recommendedRouteEl = document.getElementById('recommendedRoute');

    // Main Route
    currentRouteEl.innerHTML = `
        <h3 style="color: #ef4444; margin-bottom: 15px;">❌ Current Route</h3>
        <p><strong>${data.main_route.name}</strong></p>
        <p>🚨 Congestion: ${data.main_route.congestion_level}%</p>
        <p>⚠️ Accidents Reported: ${data.main_route.accidents_reported}</p>
        <p>⏱️ Estimated Time: ${data.main_route.estimated_time_minutes} mins</p>
        <p>📏 Distance: ${data.main_route.distance_km} km</p>
        <p>⚡ Risk Level: ${data.main_route.risk_level}</p>
        ${data.recommendation === 'main' ? '<p style="color: #10b981; margin-top: 10px; font-weight: bold;">✅ Recommended Route</p>' : ''}
    `;

    // Alternative Route
    recommendedRouteEl.innerHTML = `
        <h3 style="color: #10b981; margin-bottom: 15px;">✅ Alternative Route</h3>
        <p><strong>${data.alternative_route.name}</strong></p>
        <p>🚗 Congestion: ${data.alternative_route.congestion_level}%</p>
        <p>✨ Accidents Reported: ${data.alternative_route.accidents_reported}</p>
        <p>⏱️ Estimated Time: ${data.alternative_route.estimated_time_minutes} mins</p>
        <p>📏 Distance: ${data.alternative_route.distance_km} km</p>
        <p>⚡ Risk Level: ${data.alternative_route.risk_level}</p>
        ${data.recommendation === 'alternative' ? '<p style="color: #10b981; margin-top: 10px; font-weight: bold;">✅ Recommended Route</p>' : ''}
        ${data.time_difference_minutes > 0 ? `<p style="margin-top: 15px; padding: 10px; background: white; border-radius: 5px; color: #10b981;"><strong>⏰ Save ${data.time_difference_minutes} minutes!</strong></p>` : ''}
    `;

    showElement('routeResults');
    showToast('Route analysis complete!', 'success');
}

/**
 * Setup driver verification
 */
function setupDriverVerification() {
    const verifyBtn = document.getElementById('verifyDriver');

    verifyBtn.addEventListener('click', async () => {
        const licenseNumber = document.getElementById('verificationId').value.trim();

        if (!licenseNumber) {
            showToast('Please enter a license number', 'error');
            return;
        }

        // Show loading
        showLoading('verifyLoadingSpinner');
        hideElement('verificationResults');

        try {
            const result = await api.verifyDriver(licenseNumber);

            if (result.success) {
                displayVerificationResults(result.data);
            } else {
                throw new Error(result.error || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            displayVerificationError(error.message);
        } finally {
            hideLoading('verifyLoadingSpinner');
        }
    });
}

/**
 * Display verification results
 */
function displayVerificationResults(data) {
    const resultsContainer = document.getElementById('verificationResults');

    const html = `
        <div class="verification-card">
            <div class="verification-header">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>✅ Verification Successful</h3>
            </div>

            <div class="verification-grid">
                <div class="verification-item">
                    <label>Full Name</label>
                    <value>${data.driver_info.full_name}</value>
                </div>
                <div class="verification-item">
                    <label>License Number</label>
                    <value>${data.driver_info.license_number}</value>
                </div>
                <div class="verification-item">
                    <label>License Expiry</label>
                    <value>${data.driver_info.license_expiry}</value>
                </div>
                <div class="verification-item">
                    <label>License Status</label>
                    <value style="color: ${data.driver_info.license_valid ? '#10b981' : '#ef4444'}">
                        ${data.driver_info.license_valid ? '✅ Valid' : '❌ Expired'}
                    </value>
                </div>
                <div class="verification-item">
                    <label>Insurance Provider</label>
                    <value>${data.driver_info.insurance_number}</value>
                </div>
                <div class="verification-item">
                    <label>Insurance Expiry</label>
                    <value>${data.driver_info.insurance_expiry}</value>
                </div>
                <div class="verification-item">
                    <label>Insurance Status</label>
                    <value style="color: ${data.driver_info.insurance_valid ? '#10b981' : '#ef4444'}">
                        ${data.driver_info.insurance_valid ? '✅ Valid' : '❌ Expired'}
                    </value>
                </div>
                <div class="verification-item">
                    <label>Vehicle Number</label>
                    <value>${data.driver_info.vehicle_number}</value>
                </div>
                <div class="verification-item">
                    <label>Road Worthiness</label>
                    <value>${data.driver_info.road_worthiness}</value>
                </div>
                <div class="verification-item">
                    <label>RW Expiry</label>
                    <value>${data.driver_info.road_worthiness_expiry}</value>
                </div>
                <div class="verification-item">
                    <label>RW Status</label>
                    <value style="color: ${data.driver_info.road_worthiness_valid ? '#10b981' : '#ef4444'}">
                        ${data.driver_info.road_worthiness_valid ? '✅ Valid' : '❌ Expired'}
                    </value>
                </div>
                <div class="verification-item">
                    <label>Overall Status</label>
                    <value style="color: ${data.driver_info.all_documents_valid ? '#10b981' : '#ef4444'}; font-weight: bold;">
                        ${data.driver_info.all_documents_valid ? '✅ ALL VALID' : '⚠️ SOME EXPIRED'}
                    </value>
                </div>
            </div>

            <div class="blockchain-hash">
                <label>🔗 Blockchain Transaction Hash (Polygon Mumbai)</label>
                <code>${data.blockchain_info.blockchain_hash}</code>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #eef2ff; border-radius: 8px; font-size: 14px;">
                <strong>Blockchain:</strong> ${data.blockchain_info.verified_on_chain ? '✅ Verified on Polygon Mumbai Testnet' : '⚠️ Not yet verified on chain'}
                <br>
                <strong>Wallet:</strong> ${data.blockchain_info.wallet_address}
                ${data.blockchain_info.explorer_url ? `<br><a href="${data.blockchain_info.explorer_url}" target="_blank" style="color: #8247e5;">View on PolygonScan →</a>` : ''}
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    showElement('verificationResults');
    showToast('Driver verified successfully!', 'success');
}

/**
 * Display verification error
 */
function displayVerificationError(errorMessage) {
    const resultsContainer = document.getElementById('verificationResults');

    resultsContainer.innerHTML = `
        <div class="alert alert-danger">
            <h3>❌ Verification Failed</h3>
            <p>${errorMessage}</p>
            <p style="margin-top: 10px; font-size: 14px;">This driver may not be registered in the system yet.</p>
        </div>
    `;

    showElement('verificationResults');
    showToast('Verification failed', 'error');
}

/**
 * Setup driver registration
 */
function setupDriverRegistration() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if wallet is connected
        if (!web3Manager.isConnected()) {
            showToast('Please connect your MetaMask wallet first', 'error');
            return;
        }

        // Collect form data
        const formData = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            license_number: document.getElementById('licenseNumber').value,
            license_expiry: document.getElementById('licenseExpiry').value,
            vehicle_plate: document.getElementById('vehiclePlate').value,
            insurance_provider: document.getElementById('insuranceProvider').value,
            insurance_expiry: document.getElementById('insuranceExpiry').value,
            road_cert_number: document.getElementById('roadCertNumber').value,
            cert_expiry: document.getElementById('certExpiry').value,
            wallet_address: web3Manager.getWalletAddress()
        };

        // Show loading
        showLoading('registerLoadingSpinner');
        hideElement('registerResults');

        try {
            const result = await api.registerDriver(formData);

            if (result.success) {
                displayRegistrationSuccess(result);
                registerForm.reset();
            } else {
                throw new Error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            displayRegistrationError(error.message);
        } finally {
            hideLoading('registerLoadingSpinner');
        }
    });
}

/**
 * Display registration success
 */
function displayRegistrationSuccess(result) {
    const resultsContainer = document.getElementById('registerResults');

    const html = `
        <div class="alert alert-success">
            <h3>✅ Registration Successful!</h3>
            <p>Your driver profile has been registered on the Polygon Mumbai blockchain.</p>
            <div style="margin-top: 15px; background: white; padding: 15px; border-radius: 8px;">
                <strong>🔗 Transaction Hash:</strong><br>
                <code style="font-size: 12px; word-break: break-all; color: #8247e5;">${result.blockchain_tx}</code>
            </div>
            <div style="margin-top: 15px;">
                <strong>📄 License Number:</strong> ${result.driver.license_number}<br>
                <strong>👤 Name:</strong> ${result.driver.first_name} ${result.driver.last_name}<br>
                <strong>💼 Wallet Address:</strong> ${result.driver.wallet_address}
            </div>
            ${result.explorer_url ? `
            <div style="margin-top: 15px;">
                <a href="${result.explorer_url}" target="_blank" style="color: #8247e5; text-decoration: none; font-weight: 600;">
                    🔍 View on PolygonScan →
                </a>
            </div>
            ` : ''}
            <p style="margin-top: 15px; color: #8247e5; font-weight: 600;">
                ✨ Your information is now verifiable on the blockchain!
            </p>
        </div>
    `;

    resultsContainer.innerHTML = html;
    showElement('registerResults');
    showToast('Registration successful!', 'success');
}

/**
 * Display registration error
 */
function displayRegistrationError(errorMessage) {
    const resultsContainer = document.getElementById('registerResults');

    resultsContainer.innerHTML = `
        <div class="alert alert-danger">
            <h3>❌ Registration Failed</h3>
            <p>${errorMessage}</p>
        </div>
    `;

    showElement('registerResults');
    showToast('Registration failed', 'error');
}

/**
 * Load statistics
 */
async function loadStatistics() {
    try {
        const result = await api.getStatistics();

        if (result.success && result.data) {
            updateStatistics(result.data);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

/**
 * Update statistics on home page
 */
function updateStatistics(data) {
    const totalAccidentsEl = document.getElementById('totalAccidents');
    const roadUsersEl = document.getElementById('roadUsers');

    if (totalAccidentsEl && data.accidents) {
        totalAccidentsEl.textContent = data.accidents.total_accidents.toLocaleString();
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

/**
 * Show loading spinner
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Hide loading spinner
 */
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Show element
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Hide element
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// Make functions available globally for debugging
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;