// ============================================
// API Client for Smart Traffic Management System
// ============================================

// Determine API base URL based on environment
const API_BASE_URL = (function() {
    const hostname = window.location.hostname;

    // If running locally
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }

    // If deployed on Vercel (production)
    // IMPORTANT: Replace this with your actual Render backend URL
    return 'https://trac-backend.onrender.com/api';
})();

// Log the API URL for debugging
console.log('🔗 API Base URL:', API_BASE_URL);

class APIClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async predictRoute(startLocation, endLocation) {
        try {
            const response = await fetch(this.baseUrl + '/predict/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_location: startLocation,
                    end_location: endLocation
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Prediction failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (predictRoute):', error);
            throw error;
        }
    }

    async verifyDriver(licenseNumber) {
        try {
            const response = await fetch(this.baseUrl + '/verify/driver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    license_number: licenseNumber
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (verifyDriver):', error);
            throw error;
        }
    }

    async registerDriver(driverData) {
        try {
            const response = await fetch(this.baseUrl + '/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (registerDriver):', error);
            throw error;
        }
    }

    async getStatistics() {
        try {
            const response = await fetch(this.baseUrl + '/predict/statistics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch statistics');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (getStatistics):', error);
            throw error;
        }
    }

    async getAccidentHotspots() {
        try {
            const response = await fetch(this.baseUrl + '/predict/accident-hotspots', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch hotspots');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (getAccidentHotspots):', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const baseUrl = this.baseUrl.replace('/api', '');
            const response = await fetch(baseUrl + '/health', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Health check failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (healthCheck):', error);
            throw error;
        }
    }

    async checkDocumentValidity(licenseNumber) {
        try {
            const response = await fetch(this.baseUrl + '/verify/check-validity/' + licenseNumber, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to check validity');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (checkDocumentValidity):', error);
            throw error;
        }
    }

    async verifyByWallet(walletAddress) {
        try {
            const response = await fetch(this.baseUrl + '/verify/wallet/' + walletAddress, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (verifyByWallet):', error);
            throw error;
        }
    }

    async getBlockchainStatus() {
        try {
            const response = await fetch(this.baseUrl + '/verify/blockchain-status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get blockchain status');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (getBlockchainStatus):', error);
            throw error;
        }
    }
}

// Create and export API client instance
const api = new APIClient();

// Make it available globally
window.api = api;

console.log('✅ API Client initialized');