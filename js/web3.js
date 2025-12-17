// ============================================
// Web3 / Polygon MetaMask Integration
// ============================================

class Web3Manager {
    constructor() {
        this.walletAddress = null;
        this.connected = false;
        this.provider = null;
        this.chainId = null;

        // Polygon Mumbai Testnet configuration
        this.polygonMumbai = {
            chainId: '0x13881', // 80001 in hex
            chainName: 'Polygon Mumbai Testnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com']
        };
    }

    /**
     * Connect to MetaMask wallet
     */
    async connectWallet() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                this.walletAddress = accounts[0];
                this.connected = true;
                this.provider = window.ethereum;

                // Get current chain ID
                this.chainId = await window.ethereum.request({
                    method: 'eth_chainId'
                });

                console.log('Connected to chain:', this.chainId);

                // Check if we're on Polygon Mumbai
                if (this.chainId !== this.polygonMumbai.chainId) {
                    const switched = await this.switchToPolygonMumbai();
                    if (!switched) {
                        this.showToast('Please switch to Polygon Mumbai Testnet manually', 'warning');
                    }
                }

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        this.disconnectWallet();
                    } else {
                        this.walletAddress = accounts[0];
                        this.updateUI();
                        this.showToast('Account changed', 'success');
                    }
                });

                // Listen for chain changes
                window.ethereum.on('chainChanged', (chainId) => {
                    console.log('Chain changed to:', chainId);
                    this.chainId = chainId;
                    window.location.reload();
                });

                this.updateUI();
                this.showToast('Wallet connected successfully!', 'success');

                return {
                    success: true,
                    address: this.walletAddress,
                    chainId: this.chainId
                };

            } else {
                // MetaMask not installed
                this.showToast('Please install MetaMask wallet', 'error');

                // Open MetaMask download page
                window.open('https://metamask.io/download/', '_blank');

                // Generate mock wallet for demo
                return this.generateMockWallet();
            }
        } catch (error) {
            console.error('Wallet connection error:', error);

            if (error.code === 4001) {
                this.showToast('Connection rejected by user', 'error');
            } else {
                this.showToast('Failed to connect wallet', 'error');
            }

            // Fallback to mock wallet for demo
            return this.generateMockWallet();
        }
    }

    /**
     * Switch to Polygon Mumbai Testnet
     */
    async switchToPolygonMumbai() {
        try {
            if (!window.ethereum) {
                return false;
            }

            // Try to switch to Polygon Mumbai
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.polygonMumbai.chainId }]
            });

            this.chainId = this.polygonMumbai.chainId;
            this.showToast('Switched to Polygon Mumbai Testnet', 'success');
            return true;

        } catch (switchError) {
            // Chain not added to MetaMask, try to add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [this.polygonMumbai]
                    });

                    this.chainId = this.polygonMumbai.chainId;
                    this.showToast('Polygon Mumbai Testnet added!', 'success');
                    return true;

                } catch (addError) {
                    console.error('Failed to add network:', addError);
                    return false;
                }
            }

            console.error('Failed to switch network:', switchError);
            return false;
        }
    }

    /**
     * Generate mock wallet for demo purposes
     */
    generateMockWallet() {
        const mockAddress = '0x' + Array.from({length: 40}, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');

        this.walletAddress = mockAddress;
        this.connected = true;
        this.updateUI();

        this.showToast('Demo wallet generated (Install MetaMask for real functionality)', 'success');

        return {
            success: true,
            address: mockAddress,
            demo: true
        };
    }

    /**
     * Disconnect wallet
     */
    disconnectWallet() {
        this.walletAddress = null;
        this.connected = false;
        this.provider = null;
        this.chainId = null;
        this.updateUI();
        this.showToast('Wallet disconnected', 'success');
    }

    /**
     * Get current wallet address
     */
    getWalletAddress() {
        return this.walletAddress;
    }

    /**
     * Check if wallet is connected
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Get wallet balance
     */
    async getBalance() {
        try {
            if (!this.connected || !window.ethereum) {
                return '0';
            }

            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.walletAddress, 'latest']
            });

            // Convert from Wei to Ether (MATIC)
            const balanceInEther = parseInt(balance, 16) / 1e18;
            return balanceInEther.toFixed(4);
        } catch (error) {
            console.error('Balance fetch error:', error);
            return '0';
        }
    }

    /**
     * Request test MATIC from faucet
     */
    requestTestMatic() {
        if (this.walletAddress) {
            const faucetUrl = `https://faucet.polygon.technology/`;
            window.open(faucetUrl, '_blank');
            this.showToast('Opening Polygon Faucet...', 'success');
        } else {
            this.showToast('Please connect wallet first', 'error');
        }
    }

    /**
     * Update UI with wallet info
     */
    updateUI() {
        const connectBtn = document.getElementById('connectWallet');
        const walletAddressEl = document.getElementById('walletAddress');
        const walletInputEl = document.getElementById('walletAddressInput');

        if (this.connected && this.walletAddress) {
            // Update connect button
            const shortAddress = `${this.walletAddress.substring(0, 6)}...${this.walletAddress.substring(38)}`;
            connectBtn.textContent = shortAddress;
            connectBtn.classList.add('connected');

            // Show wallet address display
            if (walletAddressEl) {
                walletAddressEl.textContent = shortAddress;
                walletAddressEl.classList.remove('hidden');
            }

            // Auto-fill wallet input in registration form
            if (walletInputEl) {
                walletInputEl.value = this.walletAddress;
            }

            // Show network info
            if (this.chainId === this.polygonMumbai.chainId) {
                console.log('✅ Connected to Polygon Mumbai Testnet');
            } else {
                console.log('⚠️ Not on Polygon Mumbai, chain:', this.chainId);
            }

        } else {
            // Reset UI
            connectBtn.textContent = 'Connect MetaMask';
            connectBtn.classList.remove('connected');

            if (walletAddressEl) {
                walletAddressEl.classList.add('hidden');
            }

            if (walletInputEl) {
                walletInputEl.value = '';
            }
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    /**
     * Sign message with wallet
     */
    async signMessage(message) {
        try {
            if (!this.connected || !window.ethereum) {
                throw new Error('Wallet not connected');
            }

            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, this.walletAddress]
            });

            return signature;
        } catch (error) {
            console.error('Sign message error:', error);
            throw error;
        }
    }

    /**
     * Get network name
     */
    getNetworkName() {
        if (!this.chainId) return 'Not connected';

        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Polygon Mumbai Testnet',
            '0xaa36a7': 'Sepolia Testnet',
            '0x5': 'Goerli Testnet'
        };

        return networks[this.chainId] || `Unknown (${this.chainId})`;
    }

    /**
     * Check if on correct network
     */
    isOnPolygonMumbai() {
        return this.chainId === this.polygonMumbai.chainId;
    }
}

// Create and export Web3Manager instance
const web3Manager = new Web3Manager();

// Make it available globally
window.web3Manager = web3Manager;

// Auto-connect if previously connected
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts.length > 0) {
                console.log('Auto-connecting to previously connected wallet...');
                await web3Manager.connectWallet();
            }
        } catch (error) {
            console.error('Auto-connect error:', error);
        }
    }
});