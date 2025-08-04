class Calculator {
    constructor() {
        this.previousOperand = "";
        this.currentOperand = '0';
        this.operation = undefined;
        this.statusMessages = [
            'Listo',
            'Calculando...',
            'Operación completada',
            'Error de división por cero',
            'Entrada inválida'
        ];
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
        this.updateStatus('Listo');
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
        this.updateStatus('Borrando...');
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
        this.updateStatus('Entrada de número');
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
        this.updateStatus('Operación seleccionada');
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.updateStatus('Error: División por cero');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
        this.updateStatus('Operación completada');
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
        this.updateStatus('Signo cambiado');
    }

    calculatePercentage() {
        if (this.currentOperand === '0') return;
        const current = parseFloat(this.currentOperand);
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
        this.updateStatus('Porcentaje calculado');
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('es', {
                maximumFractionDigits: 0
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        document.getElementById('current-operand').textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            document.getElementById('previous-operand').textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.getElementById('previous-operand').textContent = '';
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status-text');
        statusElement.textContent = message;
        
        // Reset status after 2 seconds
        setTimeout(() => {
            if (statusElement.textContent === message) {
                statusElement.textContent = 'Listo';
            }
        }, 2000);
    }
}

const calculator = new Calculator();

// Funciones globales para los botones
function appendNumber(number) {
    calculator.appendNumber(number);
}

function chooseOperation(operation) {
    calculator.chooseOperation(operation);
}

function compute() {
    calculator.compute();
}

function clearAll() {
    calculator.clear();
}

function deleteLast() {
    calculator.delete();
}

function appendDecimal() {
    calculator.appendNumber('.');
}

function toggleSign() {
    calculator.toggleSign();
}

function calculatePercentage() {
    calculator.calculatePercentage();
}

// Efectos de botones
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Efecto de vibración en dispositivos móviles
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // Efecto visual adicional
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}

// Inicializar efectos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    addButtonEffects();
    calculator.updateDisplay();
});

// Soporte para teclado
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+') {
        chooseOperation('+');
    } else if (event.key === '-') {
        chooseOperation('-');
    } else if (event.key === '*') {
        chooseOperation('×');
    } else if (event.key === '/') {
        chooseOperation('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
        compute();
    } else if (event.key === 'Backspace') {
        deleteLast();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === '%') {
        calculatePercentage();
    }
}); 