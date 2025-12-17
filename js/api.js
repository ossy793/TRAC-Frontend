// ============================================
// API Client for Smart Traffic Management System
// ============================================

// Smart URL detection
const API_BASE_URL = (function() {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Production backend URL
        return 'https://trac-backend.onrender.com';  // UPDATE THIS WITH YOUR RENDER URL
    }
    // Development backend URL
    return 'http://localhost:5000/api';
})();

console.log('🔗 API Base URL:', API_BASE_URL);

class APIClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Predict optimal route
     */
    async predictRoute(startLocation, endLocation) {
        try {
            const response = await fetch(`${this.baseUrl}/predict/route`, {
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

    /**
     * Verify driver by license number
     */
    async verifyDriver(licenseNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/driver`, {
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

    /**
     * Register new driver
     */
    async registerDriver(driverData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
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

    /**
     * Get traffic statistics
     */
    async getStatistics() {
        try {
            const response = await fetch(`${this.baseUrl}/predict/statistics`, {
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

    /**
     * Get accident hotspots
     */
    async getAccidentHotspots() {
        try {
            const response = await fetch(`${this.baseUrl}/predict/accident-hotspots`, {
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

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
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

    /**
     * Check document validity
     */
    async checkDocumentValidity(licenseNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/check-validity/${licenseNumber}`, {
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

    /**
     * Verify driver by wallet address
     */
    async verifyByWallet(walletAddress) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/wallet/${walletAddress}`, {
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

    /**
     * Get blockchain status
     */
    async getBlockchainStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/verify/blockchain-status`, {
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
window.api = api;// ============================================
// API Client for Smart Traffic Management System
// ============================================

// Smart URL detection
const API_BASE_URL = (function() {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Production backend URL
        return 'https://your-backend-name.onrender.com/api';  // UPDATE THIS WITH YOUR RENDER URL
    }
    // Development backend URL
    return 'http://localhost:5000/api';
})();

console.log('🔗 API Base URL:', API_BASE_URL);

class APIClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Predict optimal route
     */
    async predictRoute(startLocation, endLocation) {
        try {
            const response = await fetch(`${this.baseUrl}/predict/route`, {
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

    /**
     * Verify driver by license number
     */
    async verifyDriver(licenseNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/driver`, {
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

    /**
     * Register new driver
     */
    async registerDriver(driverData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
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

    /**
     * Get traffic statistics
     */
    async getStatistics() {
        try {
            const response = await fetch(`${this.baseUrl}/predict/statistics`, {
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

    /**
     * Get accident hotspots
     */
    async getAccidentHotspots() {
        try {
            const response = await fetch(`${this.baseUrl}/predict/accident-hotspots`, {
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

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
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

    /**
     * Check document validity
     */
    async checkDocumentValidity(licenseNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/check-validity/${licenseNumber}`, {
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

    /**
     * Verify driver by wallet address
     */
    async verifyByWallet(walletAddress) {
        try {
            const response = await fetch(`${this.baseUrl}/verify/wallet/${walletAddress}`, {
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

    /**
     * Get blockchain status
     */
    async getBlockchainStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/verify/blockchain-status`, {
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