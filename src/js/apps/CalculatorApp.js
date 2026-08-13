/**
 * Application Calculatrice
 */
export class CalculatorApp {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.display = '0';
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
  }

  open() {
    if (this.windowManager.hasWindow('calculator-window')) {
      const win = this.windowManager.getWindow('calculator-window');
      win.restore();
      return;
    }

    const content = this.render();
    
    const win = this.windowManager.createWindow('calculator-window', 'Calculatrice', content, {
      width: '320px',
      height: '450px',
      draggable: true
    });

    setTimeout(() => this.initCalculator(), 100);
  }

  render() {
    return `
      <div class="calc-wrapper h-full flex flex-col">
        <div id="calc-display" class="bg-gray-900 text-white text-right p-4 text-3xl font-mono rounded mb-2">0</div>
        <div class="grid grid-cols-4 gap-2 flex-1">
          <button data-calc="clear" class="calc-btn bg-red-500 hover:bg-red-600 text-white rounded font-bold">C</button>
          <button data-calc="backspace" class="calc-btn bg-gray-600 hover:bg-gray-700 text-white rounded font-bold">⌫</button>
          <button data-calc="percent" class="calc-btn bg-gray-600 hover:bg-gray-700 text-white rounded font-bold">%</button>
          <button data-calc="divide" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">÷</button>
          
          <button data-calc="7" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">7</button>
          <button data-calc="8" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">8</button>
          <button data-calc="9" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">9</button>
          <button data-calc="multiply" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">×</button>
          
          <button data-calc="4" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">4</button>
          <button data-calc="5" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">5</button>
          <button data-calc="6" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">6</button>
          <button data-calc="subtract" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">−</button>
          
          <button data-calc="1" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">1</button>
          <button data-calc="2" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">2</button>
          <button data-calc="3" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">3</button>
          <button data-calc="add" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">+</button>
          
          <button data-calc="negate" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">±</button>
          <button data-calc="0" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">0</button>
          <button data-calc="decimal" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">.</button>
          <button data-calc="equals" class="calc-btn bg-green-500 hover:bg-green-600 text-white rounded font-bold">=</button>
        </div>
      </div>
    `;
  }

  initCalculator() {
    const buttons = document.querySelectorAll('[data-calc]');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.calc;
        this.handleInput(action);
        this.updateDisplay();
      });
    });

    // Support clavier
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleInput(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'percent':
        this.percent();
        break;
      case 'negate':
        this.negate();
        break;
      case 'decimal':
        this.inputDecimal();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.inputOperation(action);
        break;
      case 'equals':
        this.calculate();
        break;
      default:
        this.inputDigit(action);
    }
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.display = digit;
      this.waitingForOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.display = '0.';
      this.waitingForOperand = false;
      return;
    }
    
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  clear() {
    this.display = '0';
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
  }

  backspace() {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
  }

  percent() {
    const value = parseFloat(this.display);
    this.display = String(value / 100);
  }

  negate() {
    const value = parseFloat(this.display);
    this.display = String(-value);
  }

  inputOperation(nextOp) {
    const inputValue = parseFloat(this.display);

    if (this.previousValue === null) {
      this.previousValue = inputValue;
    } else if (this.operation && !this.waitingForOperand) {
      const result = this.performOperation(this.operation, this.previousValue, inputValue);
      this.display = String(result);
      this.previousValue = result;
    }

    this.waitingForOperand = true;
    this.operation = nextOp;
  }

  performOperation(op, a, b) {
    switch (op) {
      case 'add':
        return a + b;
      case 'subtract':
        return a - b;
      case 'multiply':
        return a * b;
      case 'divide':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  }

  calculate() {
    if (!this.operation || this.previousValue === null) return;

    const inputValue = parseFloat(this.display);
    const result = this.performOperation(this.operation, this.previousValue, inputValue);

    this.display = String(result);
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
  }

  updateDisplay() {
    const displayEl = document.getElementById('calc-display');
    if (displayEl) {
      // Formater l'affichage
      let formatted = this.display;
      if (formatted.length > 12) {
        formatted = parseFloat(formatted).toExponential(6);
      }
      displayEl.textContent = formatted;
    }
  }

  handleKeyboard(e) {
    if (!this.windowManager.hasWindow('calculator-window')) return;
    
    const key = e.key;
    
    if (/[0-9]/.test(key)) {
      this.handleInput(key);
    } else if (key === '.') {
      this.handleInput('decimal');
    } else if (key === '+' || key === '-') {
      this.handleInput(key === '+' ? 'add' : 'subtract');
    } else if (key === '*') {
      this.handleInput('multiply');
    } else if (key === '/') {
      e.preventDefault();
      this.handleInput('divide');
    } else if (key === 'Enter' || key === '=') {
      this.handleInput('equals');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      this.handleInput('clear');
    } else if (key === 'Backspace') {
      this.handleInput('backspace');
    } else if (key === '%') {
      this.handleInput('percent');
    }
    
    this.updateDisplay();
  }
}
