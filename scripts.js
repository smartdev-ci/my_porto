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
$(document).ready(function() {
    const greetingMessage = 'Welcome to the Command Prompt\nType "help" to see available commands.\n ';
    const terminal = $('#terminal').terminal(function(command, term) {
        switch (command.trim().toLowerCase()) {
            case 'clear':
                term.clear();
                term.echo(greetingMessage);
                break;
            case 'help':
                term.echo('Available commands:');
                term.echo('clear - Clears the terminal.');
                term.echo('help - Shows this help message.');
                term.echo('about - Displays information about this portfolio.');
                term.echo('exit - Closes the terminal.');
                break;
            case 'about':
                term.echo('This is a portfolio command prompt simulation.');
                term.echo('Created by Aristide Ghislain Adouko.');
                break;
            case 'exit':
                closeModal('command-prompt-modal');
                // Pass the terminal object to resetTerminal
                resetTerminal(terminal);
                break;
            default:
                term.echo('Command not recognized.');
                break;
        }
    }, {
        greetings: greetingMessage,
        prompt: '~/aristide.adouko@epitech.eu > '
    });

    // Fonction pour fermer la modale
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Réinitialiser le terminal
    function resetTerminal(term) {
        if (term) {
            term.clear();
            term.echo('Welcome to the Command Prompt');
            term.echo('Type "help" to see available commands.');
            term.echo('> ');
        } else {
            console.error('Terminal instance is undefined.');
        }
    }

    // Fonction pour ouvrir la modale
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
    };

    // Ajoute une fonction pour ouvrir le terminal au besoin
    window.initializeTerminal = function() {
        openModal('command-prompt-modal');
    };
});

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
$(document).ready(function() {
    handleCalculator();
});

function handleCalculator() {
    const calculatorIcon = document.getElementById('calculator-icon');
    const calculator = document.getElementById('calculator');
    const calculatorHeader = document.getElementById('calculator-header');
    const closeCalculatorButton = document.getElementById('close-calculator');
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');

    // Déboguer pour vérifier que les éléments sont trouvés
    console.log('calculatorIcon:', calculatorIcon);
    console.log('calculator:', calculator);
    console.log('calculatorHeader:', calculatorHeader);
    console.log('closeCalculatorButton:', closeCalculatorButton);
    console.log('display:', display);
    console.log('buttons:', buttons);

    if (!calculatorIcon || !calculator || !calculatorHeader || !closeCalculatorButton || !display) {
        console.warn('Un ou plusieurs éléments nécessaires sont manquants.');
        return;
    }

    let offsetX, offsetY, isDragging = false;

    // Afficher la calculatrice lorsqu'on clique sur l'icône
    calculatorIcon.addEventListener('click', () => {
        console.log('Afficher la calculatrice'); // Déboguer le clic
        calculator.classList.remove('hidden');
    });

    // Bouton Fermé
    closeCalculatorButton.addEventListener('click', () => {
        console.log('Fermer la calculatrice'); // Déboguer le clic
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
                calculator.classList.add('hidden'); // Cacher la calculatrice
            } else {
                display.textContent += value; // Ajouter la valeur du bouton à l'affichage
            }
        });
    });

    function calculateResult() {
        try {
            // Utilisation de la méthode Function au lieu de eval pour plus de sécurité
            display.textContent = new Function('return ' + display.textContent)();
        } catch (error) {
            display.textContent = 'Error';
        }
    }
}


// Gestion de la recherche
function handleSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    // Vérifie que l'élément de recherche existe
    if (!searchInput) {
        console.warn('L\'élément de recherche n\'a pas été trouvé.');
        return;
    }
    
    // Supprime les anciens écouteurs d'événements pour éviter les doublons
    searchInput.removeEventListener('input', onSearchInput);
    searchInput.addEventListener('input', onSearchInput);

    function onSearchInput(event) {
        const searchTerm = event.target.value.toLowerCase();

        // Vérifie que les éléments existent
        const icons = document.querySelectorAll('.desktop-icons .icon');
        if (icons.length === 0) {
            console.warn('Aucun élément à filtrer.');
            return;
        }

        icons.forEach(icon => {
            // Utiliser un texte par défaut si span est absent
            const span = icon.querySelector('span');
            const text = span ? span.textContent.toLowerCase() : '';
            icon.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }
}

// Appel de la fonction handleSearch pour initialiser les écouteurs
handleSearch();

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