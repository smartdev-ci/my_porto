/**
 * Système de notifications Toast
 */
export class NotificationManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
      info: 'ph-info',
      success: 'ph-check-circle',
      warning: 'ph-warning',
      error: 'ph-x-circle'
    };

    const colors = {
      info: 'border-blue-500/20',
      success: 'border-green-500/20',
      warning: 'border-yellow-500/20',
      error: 'border-red-500/20'
    };

    toast.innerHTML = `
      <i class="ph ${icons[type]} text-lg text-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500"></i>
      <span class="text-sm flex-1">${message}</span>
      <button class="toast-close hover:bg-white/20 rounded p-1">
        <i class="ph ph-x text-xs"></i>
      </button>
    `;

    toast.classList.add(...colors[type].split(' '));

    this.container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    setTimeout(() => this.remove(toast), duration);

    return toast;
  }

  remove(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }

  success(message) {
    return this.show(message, 'success');
  }

  error(message) {
    return this.show(message, 'error');
  }

  warning(message) {
    return this.show(message, 'warning');
  }

  info(message) {
    return this.show(message, 'info');
  }
}
