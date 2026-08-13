/**
 * Application Terminal avec xterm.js
 */
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export class TerminalApp {
  constructor(windowManager, lang = 'fr') {
    this.windowManager = windowManager;
    this.lang = lang;
    this.terminal = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.commands = this.initCommands();
  }

  initCommands() {
    return {
      help: {
        description: { fr: 'Affiche cette aide', en: 'Show this help' },
        handler: () => this.showHelp()
      },
      clear: {
        description: { fr: 'Efface le terminal', en: 'Clear the terminal' },
        handler: () => {
          this.terminal.clear();
          return '';
        }
      },
      about: {
        description: { fr: 'Affiche à propos de moi', en: 'Show about me' },
        handler: () => this.showAbout()
      },
      skills: {
        description: { fr: 'Affiche mes compétences', en: 'Show my skills' },
        handler: () => this.showSkills()
      },
      projects: {
        description: { fr: 'Affiche mes projets', en: 'Show my projects' },
        handler: () => this.showProjects()
      },
      contact: {
        description: { fr: 'Affiche mes coordonnées', en: 'Show contact info' },
        handler: () => this.showContact()
      },
      experience: {
        description: { fr: 'Affiche mon expérience', en: 'Show my experience' },
        handler: () => this.showExperience()
      },
      education: {
        description: { fr: 'Affiche ma formation', en: 'Show my education' },
        handler: () => this.showEducation()
      },
      theme: {
        description: { fr: 'Change le thème (light/dark)', en: 'Change theme (light/dark)' },
        handler: (args) => this.changeTheme(args)
      },
      lang: {
        description: { fr: 'Change la langue (fr/en)', en: 'Change language (fr/en)' },
        handler: (args) => this.changeLang(args)
      },
      cv: {
        description: { fr: 'Télécharge le CV', en: 'Download CV' },
        handler: () => this.downloadCV()
      },
      social: {
        description: { fr: 'Affiche les réseaux sociaux', en: 'Show social links' },
        handler: () => this.showSocial()
      }
    };
  }

  open() {
    if (this.windowManager.hasWindow('terminal-window')) {
      const win = this.windowManager.getWindow('terminal-window');
      win.restore();
      return;
    }

    const content = `
      <div id="terminal-container" class="w-full h-full bg-black rounded"></div>
    `;

    const win = this.windowManager.createWindow('terminal-window', 'Terminal', content, {
      width: '800px',
      height: '500px',
      draggable: true
    });

    // Initialiser xterm après que le DOM soit prêt
    setTimeout(() => this.initTerminal(), 100);
  }

  initTerminal() {
    const container = document.getElementById('terminal-container');
    if (!container) return;

    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"Cascadia Code", "Fira Code", Consolas, monospace',
      theme: {
        background: '#0c0c0c',
        foreground: '#cccccc',
        cursor: '#ffffff',
        black: '#0c0c0c',
        red: '#e74856',
        green: '#16c60c',
        yellow: '#f9f1a5',
        blue: '#3b78ff',
        magenta: '#b4009e',
        cyan: '#61d6d6',
        white: '#cccccc',
        brightBlack: '#767676',
        brightRed: '#e74856',
        brightGreen: '#16c60c',
        brightYellow: '#f9f1a5',
        brightBlue: '#3b78ff',
        brightMagenta: '#b4009e',
        brightCyan: '#61d6d6',
        brightWhite: '#ffffff'
      }
    });

    const fitAddon = new FitAddon();
    this.terminal.loadAddon(fitAddon);
    this.terminal.open(container);
    fitAddon.fit();

    // Welcome message
    this.terminal.writeln('\x1b[1;32mWelcome to Portfolio Terminal\x1b[0m');
    this.terminal.writeln(this.getText('terminal_welcome'));
    this.terminal.writeln(this.getText('terminal_help'));
    this.terminal.writeln('');
    this.terminal.writeln('Type \x1b[1;33mhelp\x1b[0m to see available commands.');
    this.terminal.writeln('');

    // Prompt
    this.terminal.write('\x1b[1;34maristide@portfolio\x1b[0m:\x1b[1;32m~\x1b[0m$ ');

    // Input handling
    let input = '';
    this.terminal.onData((e) => {
      if (e === '\r') {
        // Enter
        this.terminal.write('\r\n');
        this.executeCommand(input.trim());
        input = '';
        this.terminal.write('\x1b[1;34maristide@portfolio\x1b[0m:\x1b[1;32m~\x1b[0m$ ');
      } else if (e === '\x7f') {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          this.terminal.write('\b \b');
        }
      } else if (e === '\u001b') {
        // Arrow keys
        // Géré séparément si nécessaire
      } else {
        input += e;
        this.terminal.write(e);
      }
    });

    // Resize
    window.addEventListener('resize', () => fitAddon.fit());
  }

  executeCommand(cmdLine) {
    const [cmd, ...args] = cmdLine.split(' ');
    
    if (!cmd) {
      return;
    }

    // Historique
    if (cmdLine.trim()) {
      this.commandHistory.push(cmdLine);
      this.historyIndex = this.commandHistory.length;
    }

    const command = this.commands[cmd.toLowerCase()];
    
    if (command) {
      try {
        const result = command.handler(args);
        if (result) {
          this.terminal.writeln(result);
        }
      } catch (error) {
        this.terminal.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`);
      }
    } else {
      this.terminal.writeln(`\x1b[1;31m${this.getText('command_not_found')}: ${cmd}\x1b[0m`);
      this.terminal.writeln('Type \x1b[1;33mhelp\x1b[0m for available commands.');
    }
    
    this.terminal.writeln('');
  }

  showHelp() {
    this.terminal.writeln('\x1b[1;33mAvailable commands:\x1b[0m');
    Object.entries(this.commands).forEach(([cmd, def]) => {
      const desc = def.description[this.lang] || def.description.en;
      this.terminal.writeln(`  \x1b[1;32m${cmd.padEnd(12)}\x1b[0m ${desc}`);
    });
    this.terminal.writeln('');
  }

  showAbout() {
    import('../data.js').then(({ portfolioData }) => {
      const bio = portfolioData.personal.bio[this.lang] || portfolioData.personal.bio.en;
      this.terminal.writeln(`\x1b[1;36m${portfolioData.personal.name}\x1b[0m`);
      this.terminal.writeln(`\x1b[1;33m${portfolioData.personal.title}\x1b[0m`);
      this.terminal.writeln('');
      this.terminal.writeln(bio);
      this.terminal.writeln('');
    });
  }

  showSkills() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mSkills:\x1b[0m');
      portfolioData.skills.forEach(skill => {
        const category = skill.category[this.lang] || skill.category.en;
        this.terminal.writeln(`\n\x1b[1;36m${category}:\x1b[0m`);
        this.terminal.writeln(`  ${skill.items.join(', ')}`);
      });
      this.terminal.writeln('');
    });
  }

  showProjects() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mProjects:\x1b[0m');
      portfolioData.projects.forEach((project, index) => {
        const title = project.title[this.lang] || project.title.en;
        const desc = project.description[this.lang] || project.description.en;
        this.terminal.writeln(`\n\x1b[1;32m${index + 1}. ${title}\x1b[0m`);
        this.terminal.writeln(`   ${desc}`);
        this.terminal.writeln(`   Tech: ${project.technologies.join(', ')}`);
      });
      this.terminal.writeln('');
    });
  }

  showContact() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mContact:\x1b[0m');
      this.terminal.writeln(`  Email: \x1b[1;36m${portfolioData.personal.email}\x1b[0m`);
      this.terminal.writeln(`  Phone: \x1b[1;36m${portfolioData.personal.phone}\x1b[0m`);
      this.terminal.writeln(`  Location: \x1b[1;36m${portfolioData.personal.location}\x1b[0m`);
      this.terminal.writeln('');
    });
  }

  showExperience() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mExperience:\x1b[0m');
      portfolioData.experience.forEach(exp => {
        const title = exp.title[this.lang] || exp.title.en;
        const period = exp.period[this.lang] || exp.period.en;
        this.terminal.writeln(`\n\x1b[1;32m${title}\x1b[0m @ \x1b[1;36m${exp.company}\x1b[0m`);
        this.terminal.writeln(`  ${period} | ${exp.location}`);
        const desc = exp.description[this.lang] || exp.description.en;
        this.terminal.writeln(`  ${desc}`);
      });
      this.terminal.writeln('');
    });
  }

  showEducation() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mEducation:\x1b[0m');
      portfolioData.education.forEach(edu => {
        const degree = edu.degree[this.lang] || edu.degree.en;
        const period = edu.period[this.lang] || edu.period.en;
        this.terminal.writeln(`\n\x1b[1;32m${degree}\x1b[0m`);
        this.terminal.writeln(`  ${edu.school} (${period})`);
        const desc = edu.description[this.lang] || edu.description.en;
        this.terminal.writeln(`  ${desc}`);
      });
      this.terminal.writeln('');
    });
  }

  changeTheme(args) {
    const theme = args[0]?.toLowerCase();
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.classList.toggle('light', theme === 'light');
      localStorage.setItem('theme', theme);
      return `\x1b[1;32mTheme changed to ${theme}\x1b[0m`;
    }
    return 'Usage: theme [light|dark]';
  }

  changeLang(args) {
    const lang = args[0]?.toLowerCase();
    if (lang === 'fr' || lang === 'en') {
      this.lang = lang;
      localStorage.setItem('lang', lang);
      return `\x1b[1;32mLanguage changed to ${lang}\x1b[0m`;
    }
    return 'Usage: lang [fr|en]';
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = '/assets/docs/cv.pdf';
    link.download = 'cv.pdf';
    link.click();
    return '\x1b[1;32mDownloading CV...\x1b[0m';
  }

  showSocial() {
    import('../data.js').then(({ portfolioData }) => {
      this.terminal.writeln('\x1b[1;33mSocial Links:\x1b[0m');
      this.terminal.writeln(`  GitHub: \x1b[1;36m${portfolioData.social.github}\x1b[0m`);
      this.terminal.writeln(`  LinkedIn: \x1b[1;36m${portfolioData.social.linkedin}\x1b[0m`);
      this.terminal.writeln(`  Twitter: \x1b[1;36m${portfolioData.social.twitter}\x1b[0m`);
      this.terminal.writeln(`  Website: \x1b[1;36m${portfolioData.social.website}\x1b[0m`);
      this.terminal.writeln('');
    });
  }

  getText(key) {
    import('../translations.js').then(({ translations, defaultLang }) => {
      return translations[this.lang]?.[key] || translations[defaultLang]?.[key] || key;
    });
  }
}
