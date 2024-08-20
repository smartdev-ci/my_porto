document.addEventListener('DOMContentLoaded', () => {
    // Initialisations
    initializeTerminal();
    updateClock();
    handleCalculator();
    handleDesktopIcons();
    handleStartMenu();
    handleSearch();

    // Mise à jour de l'horloge chaque seconde
    setInterval(updateClock, 1000);
});

// Initialiser le terminal
function initializeTerminal() {
    const terminalElement = document.getElementById('terminal');
    terminal = new Terminal();
    terminal.open(terminalElement);

    // Initial prompt
    terminal.writeln('Welcome to the Command Prompt');
    terminal.writeln('Type "help" to see available commands.');
    terminal.write('> ');

    let currentInput = '';

    terminal.onData(data => {
        if (data === '\r') { // Entrée
            terminal.writeln('');
            handleTerminalCommand(currentInput.trim());
            currentInput = '';
        } else if (data === '\u007F') { // Backspace
            currentInput = currentInput.slice(0, -1);
            terminal.write('\b \b');
        } else {
            currentInput += data;
            terminal.write(data);
        }
    });
}

function handleTerminalCommand(command) {
    switch (command.toLowerCase()) {
        case 'clear':
            terminal.clear();
            break;
        case 'help':
            terminal.writeln('Available commands:');
            terminal.writeln('clear - Clears the terminal.');
            terminal.writeln('help - Shows this help message.');
            terminal.writeln('about - Displays information about this portfolio.');
            break;
        case 'about':
            terminal.writeln('This is a portfolio command prompt simulation.');
            terminal.writeln('Created by Aristide Ghislain Adouko.');
            break;
        default:
            terminal.writeln('Command not recognized.');
            break;
    }
}

// Réinitialiser le terminal
function resetTerminal() {
    if (terminal) {
        terminal.clear();
        terminal.writeln('Welcome to the Command Prompt');
        terminal.writeln('Type "help" to see available commands.');
        terminal.write('> ');
    }
}

// Toggle du menu démarrer
function handleStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');

    startButton.addEventListener('click', () => {
        startMenu.classList.toggle('show');
    });
}

// Mettre à jour l'horloge
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

// Fonctionnalité de glisser-déposer pour les icônes du bureau
function handleDesktopIcons() {
    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        icon.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        icon.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            e.target.style.left = `${e.pageX - 40}px`;
            e.target.style.top = `${e.pageY - 40}px`;
        });
    });
}

// Gestion de la calculatrice
function handleCalculator() {
    const calculatorIcon = document.getElementById('calculator-icon');
    const calculator = document.getElementById('calculator');
    const calculatorHeader = document.getElementById('calculator-header');
    const closeCalculatorButton = document.getElementById('close-calculator');
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');

    let offsetX, offsetY, isDragging = false;

    // Afficher la calculatrice lorsqu'on clique sur l'icône
    calculatorIcon.addEventListener('click', () => {
        calculator.classList.remove('hidden');
    });

    // Bouton Fermé
    closeCalculatorButton.addEventListener('click', () => {
        calculator.classList.add('hidden');
    });

    // Début du drag (clic gauche uniquement)
    calculatorHeader.addEventListener('mousedown', (e) => {
        if (e.button === 0) {  // Vérification pour le clic gauche
            isDragging = true;
            offsetX = e.clientX - calculator.getBoundingClientRect().left;
            offsetY = e.clientY - calculator.getBoundingClientRect().top;
        }
    });

    // Pendant le drag
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            calculator.style.position = 'absolute';
            calculator.style.left = `${e.clientX - offsetX}px`;
            calculator.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Fin du drag
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Gestion des boutons de la calculatrice
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (value === 'C') {
                display.textContent = ''; // Réinitialiser l'affichage
            } else if (value === '=') {
                calculateResult(); // Calculer le résultat
            } else if (value === 'Fermé') {
                display.textContent = ''; // Réinitialiser l'affichage pour le bouton "Fermé"
                calculator.classList.add('hidden'); // Cacher la calculatrice
            } else {
                display.textContent += value; // Ajouter la valeur du bouton à l'affichage
            }
        });
    });

    function calculateResult() {
        try {
            display.textContent = eval(display.textContent);
        } catch (error) {
            display.textContent = 'Error';
        }
    }
}

// Gestion de la recherche
function handleSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        document.querySelectorAll('.desktop-icons .icon').forEach(icon => {
            const text = icon.querySelector('span').textContent.toLowerCase();
            icon.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Fonction pour ouvrir un modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show-modal');
    }
}

// Fonction pour fermer un modal et réinitialiser le terminal si nécessaire
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show-modal');

        // Réinitialiser le terminal si le modal fermé est celui du terminal
        if (modalId === 'command-prompt-modal') {
            resetTerminal();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le bouton de bascule et le body
    const themeToggleButton = document.getElementById('themeToggle');
    const body = document.body;

    // Fonction pour basculer entre les thèmes
    function toggleTheme() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme'); 
            themeToggleButton.textContent = '🌙'; 
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleButton.textContent = '🌞'; // Changer l'icône selon le thème
            localStorage.setItem('theme', 'dark-theme'); // Sauvegarder le thème
        }
    }

    // Ajouter l'écouteur d'événement au bouton
    themeToggleButton.addEventListener('click', toggleTheme);

    // Charger le thème sauvegardé au chargement de la page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        themeToggleButton.textContent = savedTheme === 'dark-theme' ? '🌞' : '🌙'; // Changer l'icône selon le thème sauvegardé
    }
});
