// ===== PROFILE PAGE SPECIFIC JAVASCRIPT =====

class ProfileWindowManager extends WindowControls {
  constructor() {
    super('.profile-card');
    
    this.minimizedBar = document.getElementById('minimizedBar');
    this.expandFromBar = document.getElementById('expandFromBar');
    this.letterAnimation = document.getElementById('letterAnimation');
    
    this.isMinimized = false;
    
    this.initProfileControls();
  }

  initProfileControls() {
    // Override parent init and add profile-specific functionality
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    if (this.minimizeBtn) {
      this.minimizeBtn.addEventListener('click', () => this.minimize());
    }
    
    if (this.expandBtn) {
      this.expandBtn.addEventListener('click', () => this.expand());
    }
    
    if (this.expandFromBar) {
      this.expandFromBar.addEventListener('click', () => this.expand());
    }

    // Double click to minimize/expand
    if (this.card) {
      this.card.addEventListener('dblclick', () => {
        if (this.isMinimized) {
          this.expand();
        } else {
          this.minimize();
        }
      });
    }

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  minimize() {
    if (this.isMinimized || !this.card) return;
    
    this.isMinimized = true;
    this.card.classList.add('minimizing');
    
    // Show letter animation
    if (this.letterAnimation) {
      this.letterAnimation.classList.add('sending');
    }
    
    setTimeout(() => {
      this.card.classList.add('hidden');
      if (this.minimizedBar) {
        this.minimizedBar.classList.add('show');
      }
      if (this.letterAnimation) {
        this.letterAnimation.classList.remove('sending');
      }
    }, 600);
  }

  expand() {
    if (!this.isMinimized || !this.card) return;
    
    this.isMinimized = false;
    
    if (this.minimizedBar) {
      this.minimizedBar.classList.remove('show');
    }
    
    this.card.classList.remove('hidden');
    this.card.classList.remove('minimizing');
    this.card.classList.add('expanding');
    
    setTimeout(() => {
      this.card.classList.remove('expanding');
    }, 600);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key) {
          case 'm':
            e.preventDefault();
            this.minimize();
            break;
          case 'e':
            e.preventDefault();
            this.expand();
            break;
          case 'w':
            e.preventDefault();
            this.close();
            break;
        }
      }
    });
  }
}

// Avatar Animation Manager
class AvatarManager {
  constructor() {
    this.avatar = document.getElementById('avatarImg');
    this.init();
  }

  init() {
    // Add any avatar-specific functionality here
    // For example, click handlers, hover effects, etc.
    if (this.avatar) {
      this.avatar.addEventListener('error', () => {
        console.warn('Avatar image failed to load');
        // Could add fallback image here
      });
    }
  }
}

// Initialize profile-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize profile window management
  new ProfileWindowManager();
  
  // Initialize avatar management
  new AvatarManager();
});