/**
 * Gestionnaire de fenêtres Windows
 */
import { NotificationManager } from '../utils/NotificationManager.js';

export class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.zIndex = 100;
    this.notificationManager = new NotificationManager();
    this.desktop = null;
    this.init();
  }

  init() {
    this.desktop = document.querySelector('.desktop');
    if (!this.desktop) {
      console.error('Desktop element not found');
      return;
    }
  }

  createWindow(id, title, content, options = {}) {
    const existingWindow = this.windows.get(id);
    if (existingWindow) {
      this.focusWindow(id);
      existingWindow.restore();
      return existingWindow;
    }

    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = id;
    windowEl.style.zIndex = ++this.zIndex;
    
    // Position par défaut
    const offset = Object.keys(this.windows).length * 30;
    windowEl.style.left = `${100 + offset}px`;
    windowEl.style.top = `${50 + offset}px`;
    
    // Dimensions
    if (options.width) windowEl.style.width = options.width;
    if (options.height) windowEl.style.height = options.height;

    windowEl.innerHTML = `
      <div class="window-header">
        <span class="window-title">${title}</span>
        <div class="window-controls">
          <button class="window-control minimize" title="Réduire">
            <i class="ph ph-minus"></i>
          </button>
          <button class="window-control maximize" title="Agrandir">
            <i class="ph ph-square"></i>
          </button>
          <button class="window-control close" title="Fermer">
            <i class="ph ph-x"></i>
          </button>
        </div>
      </div>
      <div class="window-content">${content}</div>
    `;

    this.desktop.appendChild(windowEl);

    const win = {
      id,
      element: windowEl,
      header: windowEl.querySelector('.window-header'),
      content: windowEl.querySelector('.window-content'),
      isMinimized: false,
      isMaximized: false,
      previousState: null,
      
      close: () => this.closeWindow(id),
      minimize: () => this.minimizeWindow(id),
      maximize: () => this.maximizeWindow(id),
      restore: () => this.restoreWindow(id),
      focus: () => this.focusWindow(id)
    };

    this.windows.set(id, win);

    // Événements
    this.setupWindowEvents(win, options);

    // Focus initial
    this.focusWindow(id);

    return win;
  }

  setupWindowEvents(win, options) {
    const { element, header } = win;

    // Focus au clic
    element.addEventListener('mousedown', () => this.focusWindow(win.id));

    // Fermeture
    header.querySelector('.close').addEventListener('click', () => win.close());

    // Minimiser
    header.querySelector('.minimize').addEventListener('click', () => win.minimize());

    // Maximiser/Restaurer
    header.querySelector('.maximize').addEventListener('click', () => {
      if (win.isMaximized) {
        win.restore();
      } else {
        win.maximize();
      }
    });

    // Drag & Drop
    if (options.draggable !== false) {
      this.makeDraggable(win);
    }

    // Redimensionnement (optionnel)
    if (options.resizable) {
      this.makeResizable(win);
    }
  }

  makeDraggable(win) {
    const { element, header } = win;
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-controls')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;
      
      element.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      element.style.left = `${startLeft + dx}px`;
      element.style.top = `${startTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.transition = '';
    });
  }

  makeResizable(win) {
    // À implémenter pour le redimensionnement
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.element.remove();
    this.windows.delete(id);

    if (this.activeWindow === id) {
      this.activeWindow = null;
    }

    this.notificationManager.info('Application fermée');
  }

  minimizeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.isMinimized = true;
    win.element.style.display = 'none';
    
    // Mettre à jour l'icône dans la taskbar
    this.updateTaskbarIcon(id, true);
  }

  maximizeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.previousState = {
      width: win.element.style.width,
      height: win.element.style.height,
      left: win.element.style.left,
      top: win.element.style.top
    };

    win.isMaximized = true;
    win.element.style.width = '100%';
    win.element.style.height = 'calc(100% - 48px)'; // Hauteur moins taskbar
    win.element.style.left = '0';
    win.element.style.top = '0';

    // Changer l'icône du bouton
    const maximizeBtn = win.header.querySelector('.maximize i');
    maximizeBtn.className = 'ph ph-squares-four';
  }

  restoreWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.isMinimized = false;
    win.element.style.display = 'flex';

    if (win.isMaximized && win.previousState) {
      win.element.style.width = win.previousState.width;
      win.element.style.height = win.previousState.height;
      win.element.style.left = win.previousState.left;
      win.element.style.top = win.previousState.top;
    }

    this.focusWindow(id);
    this.updateTaskbarIcon(id, false);
  }

  focusWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    // Réduire toutes les autres fenêtres
    this.windows.forEach((w, key) => {
      if (key !== id && !w.isMinimized) {
        w.element.style.opacity = '0.8';
      } else {
        w.element.style.opacity = '1';
      }
    });

    win.element.style.zIndex = ++this.zIndex;
    this.activeWindow = id;

    // Mettre à jour la taskbar
    this.updateActiveTaskbarIcon(id);
  }

  updateTaskbarIcon(id, isMinimized) {
    const icon = document.querySelector(`[data-window="${id}"]`);
    if (icon) {
      if (isMinimized) {
        icon.classList.remove('active');
      } else {
        icon.classList.add('active');
      }
    }
  }

  updateActiveTaskbarIcon(id) {
    document.querySelectorAll('.taskbar-icon').forEach(icon => {
      icon.classList.toggle('active', icon.dataset.window === id);
    });
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  hasWindow(id) {
    return this.windows.has(id);
  }
}
