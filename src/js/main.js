/**
 * Point d'entrée principal de l'application
 */
import { WindowManager } from './managers/WindowManager.js';
import { TerminalApp } from './apps/TerminalApp.js';
import { CalculatorApp } from './apps/CalculatorApp.js';
import { translations, defaultLang } from './translations.js';
import { portfolioData } from './data.js';

class App {
  constructor() {
    this.windowManager = null;
    this.terminalApp = null;
    this.calculatorApp = null;
    this.currentLang = 'fr';
    this.isDarkMode = false;
    this.startMenuOpen = false;
    this.contextMenu = null;
    
    this.init();
  }

  init() {
    // Charger les préférences
    this.loadPreferences();
    
    // Initialiser le gestionnaire de fenêtres
    this.windowManager = new WindowManager();
    
    // Initialiser les applications
    this.terminalApp = new TerminalApp(this.windowManager, this.currentLang);
    this.calculatorApp = new CalculatorApp(this.windowManager);
    
    // Attendre que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', () => {
      this.setupDesktop();
      this.setupTaskbar();
      this.setupStartMenu();
      this.setupContextMenu();
      this.setupClock();
      this.applyTheme();
      this.applyLanguage();
      
      console.log('Portfolio Windows 11 initialized');
    });
  }

  loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('lang');
    
    this.isDarkMode = savedTheme === 'dark';
    this.currentLang = savedLang || defaultLang;
  }

  setupDesktop() {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    // Icônes du bureau
    const desktopIcons = [
      { id: 'this-pc', name: { fr: 'Ce PC', en: 'This PC' }, icon: 'ph-desktop', action: () => this.openFileExplorer() },
      { id: 'file-explorer', name: { fr: 'Explorateur', en: 'Explorer' }, icon: 'ph-folder', action: () => this.openFileExplorer() },
      { id: 'terminal', name: { fr: 'Terminal', en: 'Terminal' }, icon: 'ph-terminal-window', action: () => this.terminalApp.open() },
      { id: 'calculator', name: { fr: 'Calculatrice', en: 'Calculator' }, icon: 'ph-calculator', action: () => this.calculatorApp.open() },
      { id: 'about', name: { fr: 'À propos', en: 'About' }, icon: 'ph-user', action: () => this.openAbout() },
      { id: 'projects', name: { fr: 'Projets', en: 'Projects' }, icon: 'ph-briefcase', action: () => this.openProjects() },
      { id: 'contact', name: { fr: 'Contact', en: 'Contact' }, icon: 'ph-envelope', action: () => this.openContact() },
      { id: 'cv', name: { fr: 'CV', en: 'CV' }, icon: 'ph-file-text', action: () => this.downloadCV() }
    ];

    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'grid grid-cols-1 gap-2';
    
    desktopIcons.forEach(iconData => {
      const iconEl = document.createElement('div');
      iconEl.className = 'desktop-icon';
      iconEl.draggable = true;
      iconEl.dataset.id = iconData.id;
      
      const name = iconData.name[this.currentLang] || iconData.name.en;
      
      iconEl.innerHTML = `
        <i class="ph ${iconData.icon} desktop-icon-icon text-white"></i>
        <span class="desktop-icon-label">${name}</span>
      `;
      
      iconEl.addEventListener('click', () => iconData.action());
      iconEl.addEventListener('dblclick', () => iconData.action());
      
      // Drag & Drop pour position
      this.setupIconDrag(iconEl);
      
      iconsContainer.appendChild(iconEl);
    });

    desktop.insertBefore(iconsContainer, desktop.firstChild);
  }

  setupIconDrag(iconEl) {
    let isDragging = false;
    
    iconEl.addEventListener('dragstart', (e) => {
      isDragging = true;
      e.dataTransfer.setData('text/plain', iconEl.dataset.id);
      setTimeout(() => iconEl.classList.add('opacity-50'), 0);
    });
    
    iconEl.addEventListener('dragend', () => {
      isDragging = false;
      iconEl.classList.remove('opacity-50');
      
      // Sauvegarder la position
      const rect = iconEl.getBoundingClientRect();
      const positions = JSON.parse(localStorage.getItem('iconPositions') || '{}');
      positions[iconEl.dataset.id] = { left: rect.left, top: rect.top };
      localStorage.setItem('iconPositions', JSON.stringify(positions));
    });
  }

  setupTaskbar() {
    const taskbar = document.querySelector('.taskbar');
    if (!taskbar) return;

    // Icônes de la barre des tâches
    const taskbarIcons = [
      { id: 'start', icon: 'ph-windows-logo', action: () => this.toggleStartMenu() },
      { id: 'search', icon: 'ph-magnifying-glass', action: () => this.focusSearch() },
      { id: 'file-explorer-taskbar', icon: 'ph-folder', window: 'explorer-window', action: () => this.openFileExplorer() },
      { id: 'terminal-taskbar', icon: 'ph-terminal-window', window: 'terminal-window', action: () => this.terminalApp.open() },
      { id: 'calculator-taskbar', icon: 'ph-calculator', window: 'calculator-window', action: () => this.calculatorApp.open() },
      { id: 'browser', icon: 'ph-globe', action: () => this.openBrowser() }
    ];

    const centerContainer = document.createElement('div');
    centerContainer.className = 'taskbar-center';

    taskbarIcons.forEach(iconData => {
      const iconEl = document.createElement('div');
      iconEl.className = 'taskbar-icon';
      if (iconData.window) {
        iconEl.dataset.window = iconData.window;
      }
      
      iconEl.innerHTML = `<i class="ph ${iconData.icon} text-xl text-white"></i>`;
      iconEl.addEventListener('click', () => iconData.action());
      
      centerContainer.appendChild(iconEl);
    });

    // Section gauche (vide pour l'instant)
    const leftContainer = document.createElement('div');
    leftContainer.className = 'taskbar-left';

    // Section droite (system tray)
    const rightContainer = document.createElement('div');
    rightContainer.className = 'taskbar-right';
    rightContainer.innerHTML = `
      <div class="taskbar-icon" id="lang-switch" title="Changer de langue">
        <i class="ph ph-translate text-white"></i>
      </div>
      <div class="taskbar-icon" id="theme-toggle" title="Changer le thème">
        <i class="ph ${this.isDarkMode ? 'ph-sun' : 'ph-moon'} text-white"></i>
      </div>
      <div class="flex flex-col items-end px-2 text-white text-xs">
        <div id="clock-time">00:00</div>
        <div id="clock-date">01/01/2024</div>
      </div>
      <div class="taskbar-icon" id="show-desktop" title="Afficher le bureau">
        <i class="ph ph-rectangle text-white"></i>
      </div>
    `;

    taskbar.appendChild(leftContainer);
    taskbar.appendChild(centerContainer);
    taskbar.appendChild(rightContainer);

    // Événements system tray
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('lang-switch').addEventListener('click', () => this.toggleLanguage());
    document.getElementById('show-desktop').addEventListener('click', () => this.showDesktop());
  }

  setupStartMenu() {
    const startMenu = document.createElement('div');
    startMenu.className = 'start-menu';
    startMenu.id = 'start-menu';
    
    startMenu.innerHTML = `
      <div class="mb-6">
        <input 
          type="text" 
          id="start-search"
          class="search-input w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-500"
          placeholder="${translations[this.currentLang]?.search_placeholder || translations.en.search_placeholder}"
        />
      </div>
      
      <div class="mb-4">
        <h3 class="text-sm font-semibold mb-3 text-white" data-i18n="pinned">Épinglé</h3>
        <div class="grid grid-cols-6 gap-4" id="pinned-apps">
          <!-- Applications épinglées -->
        </div>
      </div>
      
      <div class="mt-auto pt-4 border-t border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              ${portfolioData.personal.name.charAt(0)}
            </div>
            <div>
              <div class="text-sm font-medium text-white">${portfolioData.personal.name}</div>
              <div class="text-xs text-gray-400">${portfolioData.personal.title}</div>
            </div>
          </div>
          <button class="taskbar-icon" id="power-btn">
            <i class="ph ph-power text-white"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(startMenu);

    // Remplir les applications épinglées
    this.populatePinnedApps();

    // Recherche
    const searchInput = document.getElementById('start-search');
    searchInput.addEventListener('input', (e) => this.filterApps(e.target.value));

    // Fermer au clic extérieur
    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && !e.target.closest('[id="start"]')) {
        this.closeStartMenu();
      }
    });
  }

  populatePinnedApps() {
    const pinnedContainer = document.getElementById('pinned-apps');
    const apps = [
      { name: 'Terminal', icon: 'ph-terminal-window', action: () => this.terminalApp.open() },
      { name: 'Calculatrice', icon: 'ph-calculator', action: () => this.calculatorApp.open() },
      { name: 'Explorateur', icon: 'ph-folder', action: () => this.openFileExplorer() },
      { name: 'Projets', icon: 'ph-briefcase', action: () => this.openProjects() },
      { name: 'Compétences', icon: 'ph-star', action: () => this.openSkills() },
      { name: 'Contact', icon: 'ph-envelope', action: () => this.openContact() },
      { name: 'CV', icon: 'ph-file-text', action: () => this.downloadCV() },
      { name: 'À propos', icon: 'ph-user', action: () => this.openAbout() }
    ];

    pinnedContainer.innerHTML = apps.map(app => `
      <div class="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors" data-app="${app.name}">
        <i class="ph ${app.icon} text-2xl text-white"></i>
        <span class="text-xs text-white">${app.name}</span>
      </div>
    `).join('');

    // Ajouter les écouteurs d'événements
    pinnedContainer.querySelectorAll('[data-app]').forEach(el => {
      el.addEventListener('click', () => {
        const appName = el.dataset.app;
        const app = apps.find(a => a.name === appName);
        if (app) app.action();
        this.closeStartMenu();
      });
    });
  }

  toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
      startMenu.classList.toggle('open', this.startMenuOpen);
    }
  }

  closeStartMenu() {
    this.startMenuOpen = false;
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
      startMenu.classList.remove('open');
    }
  }

  filterApps(query) {
    // Implémentation de la recherche dans le menu démarrer
    const pinnedApps = document.querySelectorAll('#pinned-apps > div');
    const searchTerm = query.toLowerCase();
    
    pinnedApps.forEach(app => {
      const appName = app.dataset.app.toLowerCase();
      app.style.display = appName.includes(searchTerm) ? 'flex' : 'none';
    });
  }

  setupContextMenu() {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.id = 'context-menu';
    
    contextMenu.innerHTML = `
      <div class="context-menu-item" data-action="refresh">
        <i class="ph ph-arrow-clockwise mr-2"></i>Actualiser
      </div>
      <div class="border-t border-white/10 my-1"></div>
      <div class="context-menu-item" data-action="new-folder">
        <i class="ph ph-folder-plus mr-2"></i>Nouveau dossier
      </div>
      <div class="context-menu-item" data-action="properties">
        <i class="ph ph-gear mr-2"></i>Propriétés
      </div>
      <div class="border-t border-white/10 my-1"></div>
      <div class="context-menu-item" data-action="theme">
        <i class="ph ${this.isDarkMode ? 'ph-sun' : 'ph-moon'} mr-2"></i>
        ${this.isDarkMode ? 'Mode clair' : 'Mode sombre'}
      </div>
    `;

    document.body.appendChild(contextMenu);
    this.contextMenu = contextMenu;

    // Gestion des actions
    contextMenu.querySelectorAll('[data-action]').forEach(item => {
      item.addEventListener('click', () => this.handleContextMenuAction(item.dataset.action));
    });

    // Afficher/masquer
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.desktop')) {
        e.preventDefault();
        this.showContextMenu(e.clientX, e.clientY);
      }
    });

    document.addEventListener('click', () => this.hideContextMenu());
  }

  showContextMenu(x, y) {
    const contextMenu = this.contextMenu;
    if (!contextMenu) return;

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('open');
  }

  hideContextMenu() {
    const contextMenu = this.contextMenu;
    if (!contextMenu) return;

    contextMenu.classList.remove('open');
  }

  handleContextMenuAction(action) {
    switch (action) {
      case 'refresh':
        location.reload();
        break;
      case 'new-folder':
        console.log('Nouveau dossier');
        break;
      case 'properties':
        this.openAbout();
        break;
      case 'theme':
        this.toggleTheme();
        break;
    }
    this.hideContextMenu();
  }

  setupClock() {
    const updateTime = () => {
      const now = new Date();
      
      const timeEl = document.getElementById('clock-time');
      const dateEl = document.getElementById('clock-date');
      
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString(this.currentLang, { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString(this.currentLang, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = `ph ${this.isDarkMode ? 'ph-sun' : 'ph-moon'} text-white`;
    }
    
    // Mettre à jour le context menu
    const contextMenuItem = this.contextMenu?.querySelector('[data-action="theme"]');
    if (contextMenuItem) {
      contextMenuItem.innerHTML = `
        <i class="ph ${this.isDarkMode ? 'ph-sun' : 'ph-moon'} mr-2"></i>
        ${this.isDarkMode ? 'Mode clair' : 'Mode sombre'}
      `;
    }
  }

  applyTheme() {
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    document.documentElement.classList.toggle('light', !this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.applyLanguage();
  }

  applyLanguage() {
    localStorage.setItem('lang', this.currentLang);
    
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = translations[this.currentLang]?.[key] || translations.en[key];
      if (translation) {
        el.textContent = translation;
      }
    });

    // Mettre à jour le placeholder de recherche
    const searchInput = document.getElementById('start-search');
    if (searchInput) {
      searchInput.placeholder = translations[this.currentLang]?.search_placeholder || translations.en.search_placeholder;
    }

    // Mettre à jour les icônes du bureau
    this.setupDesktop();
  }

  showDesktop() {
    // Minimiser toutes les fenêtres
    this.windowManager.windows.forEach((win) => {
      if (!win.isMinimized) {
        win.minimize();
      }
    });
  }

  focusSearch() {
    const searchInput = document.getElementById('start-search');
    if (searchInput) {
      this.toggleStartMenu();
      setTimeout(() => searchInput.focus(), 300);
    }
  }

  // Actions des applications
  openFileExplorer() {
    const content = `
      <div class="flex h-full">
        <div class="w-48 border-r border-white/10 pr-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-desktop text-blue-500"></i>
              <span class="text-sm">Bureau</span>
            </div>
            <div class="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-download-simple text-green-500"></i>
              <span class="text-sm">Téléchargements</span>
            </div>
            <div class="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-documents text-yellow-500"></i>
              <span class="text-sm">Documents</span>
            </div>
            <div class="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-image text-purple-500"></i>
              <span class="text-sm">Images</span>
            </div>
          </div>
        </div>
        <div class="flex-1 p-4">
          <div class="grid grid-cols-4 gap-4">
            <div class="flex flex-col items-center p-4 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-folder text-4xl text-yellow-500"></i>
              <span class="text-xs mt-2">Projets</span>
            </div>
            <div class="flex flex-col items-center p-4 hover:bg-white/10 rounded cursor-pointer">
              <i class="ph ph-folder text-4xl text-yellow-500"></i>
              <span class="text-xs mt-2">CV</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.windowManager.createWindow('explorer-window', 'Explorateur de fichiers', content, {
      width: '700px',
      height: '500px'
    });
  }

  openAbout() {
    const bio = portfolioData.personal.bio[this.currentLang] || portfolioData.personal.bio.en;
    const content = `
      <div class="flex flex-col items-center text-center">
        <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
          ${portfolioData.personal.name.charAt(0)}
        </div>
        <h2 class="text-xl font-bold mb-2">${portfolioData.personal.name}</h2>
        <p class="text-blue-500 mb-4">${portfolioData.personal.title}</p>
        <p class="text-sm mb-4">${bio}</p>
        <div class="flex gap-4 mt-4">
          <a href="${portfolioData.social.github}" target="_blank" class="hover:text-blue-500">
            <i class="ph ph-github-logo text-2xl"></i>
          </a>
          <a href="${portfolioData.social.linkedin}" target="_blank" class="hover:text-blue-500">
            <i class="ph ph-linkedin-logo text-2xl"></i>
          </a>
          <a href="${portfolioData.social.twitter}" target="_blank" class="hover:text-blue-500">
            <i class="ph ph-twitter-logo text-2xl"></i>
          </a>
        </div>
      </div>
    `;
    
    this.windowManager.createWindow('about-window', 'À propos', content, {
      width: '500px',
      height: '400px'
    });
  }

  openProjects() {
    const projects = portfolioData.projects;
    const content = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${projects.map(project => {
          const title = project.title[this.currentLang] || project.title.en;
          const desc = project.description[this.currentLang] || project.description.en;
          return `
            <div class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <h3 class="font-bold mb-2">${title}</h3>
              <p class="text-sm text-gray-400 mb-3">${desc}</p>
              <div class="flex flex-wrap gap-2 mb-3">
                ${project.technologies.map(tech => `
                  <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">${tech}</span>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <a href="${project.link}" class="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Demo</a>
                <a href="${project.github}" class="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">GitHub</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    this.windowManager.createWindow('projects-window', 'Projets', content, {
      width: '800px',
      height: '600px'
    });
  }

  openSkills() {
    const skills = portfolioData.skills;
    const content = `
      <div class="space-y-4">
        ${skills.map(skill => {
          const category = skill.category[this.currentLang] || skill.category.en;
          return `
            <div>
              <h3 class="font-bold text-blue-400 mb-2">${category}</h3>
              <div class="flex flex-wrap gap-2">
                ${skill.items.map(item => `
                  <span class="bg-white/10 px-3 py-1 rounded-full text-sm">${item}</span>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    this.windowManager.createWindow('skills-window', 'Compétences', content, {
      width: '600px',
      height: '500px'
    });
  }

  openContact() {
    const contact = portfolioData.personal;
    const content = `
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <i class="ph ph-envelope text-blue-500 text-xl"></i>
          <div>
            <div class="text-xs text-gray-400">Email</div>
            <div>${contact.email}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <i class="ph ph-phone text-blue-500 text-xl"></i>
          <div>
            <div class="text-xs text-gray-400">Téléphone</div>
            <div>${contact.phone}</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <i class="ph ph-map-pin text-blue-500 text-xl"></i>
          <div>
            <div class="text-xs text-gray-400">Localisation</div>
            <div>${contact.location}</div>
          </div>
        </div>
        
        <form class="mt-6 space-y-4" onsubmit="event.preventDefault(); alert('Message envoyé!');">
          <input type="text" placeholder="Nom" class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded focus:border-blue-500 outline-none" />
          <input type="email" placeholder="Email" class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded focus:border-blue-500 outline-none" />
          <textarea placeholder="Message" rows="4" class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded focus:border-blue-500 outline-none"></textarea>
          <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">Envoyer</button>
        </form>
      </div>
    `;
    
    this.windowManager.createWindow('contact-window', 'Contact', content, {
      width: '500px',
      height: '600px'
    });
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = '/assets/docs/cv.pdf';
    link.download = 'cv.pdf';
    link.click();
  }

  openBrowser() {
    const content = `
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-2 mb-4">
          <input type="text" value="https://votre-site.com" class="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:border-blue-500 outline-none" />
        </div>
        <div class="flex-1 bg-white/5 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <i class="ph ph-globe text-6xl text-gray-600 mb-4"></i>
            <p class="text-gray-400">Navigateur simulé</p>
            <p class="text-xs text-gray-500 mt-2">Ouvrez votre navigateur pour visiter des sites web</p>
          </div>
        </div>
      </div>
    `;
    
    this.windowManager.createWindow('browser-window', 'Navigateur', content, {
      width: '900px',
      height: '600px'
    });
  }
}

// Démarrer l'application
window.app = new App();
