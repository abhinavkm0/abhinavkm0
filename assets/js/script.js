// ===== SHARED JAVASCRIPT =====

// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.sunIcon = document.getElementById('sunIcon');
    this.moonIcon = document.getElementById('moonIcon');
    this.body = document.body;
    
    this.init();
  }

  init() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    this.body.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);

    // Add event listeners
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.themeToggle.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  toggleTheme() {
    const currentTheme = this.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    this.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    if (theme === 'dark') {
      this.sunIcon.style.display = 'none';
      this.moonIcon.style.display = 'block';
    } else {
      this.sunIcon.style.display = 'block';
      this.moonIcon.style.display = 'none';
    }
  }

  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleTheme();
    }
  }
}

// Accessibility Manager
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add focus management
    document.addEventListener('DOMContentLoaded', () => {
      this.setupFocusManagement();
    });
  }

  setupFocusManagement() {
    const focusableElements = document.querySelectorAll('button, a[href]');
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--toggle-active)';
        element.style.outlineOffset = '2px';
      });
      element.addEventListener('blur', () => {
        element.style.outline = 'none';
      });
    });
  }
}

// Window Controls Base Class
class WindowControls {
  constructor(cardSelector) {
    this.card = document.querySelector(cardSelector);
    this.closeBtn = document.getElementById('closeBtn');
    this.minimizeBtn = document.getElementById('minimizeBtn');
    this.expandBtn = document.getElementById('expandBtn');
    
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  }

  close() {
    if (this.card) {
      this.card.style.opacity = '0';
      this.card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        this.card.style.display = 'none';
      }, 300);
    }
  }
}

// Initialize shared functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme management
  new ThemeManager();
  
  // Initialize accessibility features
  new AccessibilityManager();
  
  // Initialize base window controls
  new WindowControls('.profile-card');
});