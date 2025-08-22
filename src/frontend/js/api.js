const API_BASE_URL = 'http://127.0.0.1:3000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.tokenExpiry = localStorage.getItem('tokenExpiry');
        
        // Check token expiration on initialization
        this.checkTokenExpiration();
        
        // Set up periodic token expiration checks (every 30 seconds)
        setInterval(() => this.checkTokenExpiration(), 30000);
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
        
        // Set token expiry to 24 hours from now (standard JWT expiration)
        const expiry = Date.now() + (60 * 60 * 1000);
        this.tokenExpiry = expiry;
        localStorage.setItem('tokenExpiry', expiry.toString());
    }

    clearToken() {
        this.token = null;
        this.tokenExpiry = null;
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
    }

    checkTokenExpiration() {
        if (this.tokenExpiry && Date.now() > parseInt(this.tokenExpiry)) {
            console.warn('Token has expired');
            this.clearToken();
            
            // Only redirect if we're not already on auth or index page
            if (!window.location.pathname.includes('auth.html') && 
                !window.location.pathname.includes('index.html')) {
                showToast('Your session has expired. Please log in again.', 'warning');
                setTimeout(() => {
                    window.location.href = '/auth.html';
                }, 2000);
            }
            return false;
        }
        return true;
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    console.warn('Authentication failed - token may be expired');
                    this.clearToken();
                    
                    // Only redirect if we're not already on the auth page
                    if (!window.location.pathname.includes('auth.html') && 
                        !window.location.pathname.includes('index.html')) {
                        showToast('Your session has expired. Please log in again.', 'warning');
                        setTimeout(() => {
                            window.location.href = '/auth.html';
                        }, 1500);
                    }
                    
                    throw new Error('Authentication required');
                }
                
                const error = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier: email, password })
        });
        
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        
        return response;
    }

    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            })
        });
    }

    async getProfile() {
        return await this.request('/auth/self');
    }

    // Courses
    async getCourses(page = 1, limit = 10, search = '', category = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (search) params.append('q', search);
        if (category) params.append('category', category);
        
        return await this.request(`/courses?${params}`);
    }

    async getCourse(id) {
        return await this.request(`/courses/${id}`);
    }

    async purchaseCourse(courseId) {
        return await this.request(`/courses/${courseId}/buy`, {
            method: 'POST'
        });
    }

    async getMyCourses(page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        return await this.request(`/courses/my-courses?${params}`);
    }

    // Modules
    async getCourseModules(courseId) {
        return await this.request(`/courses/${courseId}/modules`);
    }

    async getModule(courseId, moduleId) {
        const modules = await this.getCourseModules(courseId);
        return modules.find(module => module.id === moduleId);
    }

    async completeModule(courseId, moduleId) {
        return await this.request(`/modules/${moduleId}/complete`, {
            method: 'PATCH'
        });
    }

    // Certificates
    async getCertificate(courseId) {
        return await this.request(`/certificates/course/${courseId}`);
    }

    async downloadCertificate(courseId) {
        const response = await fetch(`${API_BASE_URL}/certificates/course/${courseId}/download`, {
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to download certificate');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${courseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container') || createToastContainer();
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isAuthenticated() {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry) {
        return false;
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(tokenExpiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        return false;
    }
    
    return true;
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/auth.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth.html';
}

const api = new ApiService();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, api, formatCurrency, formatDate, showToast, debounce, isAuthenticated, requireAuth, logout };
}
