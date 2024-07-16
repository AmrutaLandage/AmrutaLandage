document.addEventListener('DOMContentLoaded', function() {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
        updateOperation();
    }

    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
        updateOperation();
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            updateOperation();
            return;
        }

        if (firstOperand == null) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const currentValue = firstOperand || 0;
            const result = performCalculation[operator](currentValue, inputValue);

            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        updateOperation();
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand
    };

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        updateOperation();
    }

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = calculator.displayValue;
    }

    function updateOperation() {
        const operation = document.querySelector('#currentOperation');
        const { firstOperand, operator, displayValue } = calculator;

        if (operator === '=') {
            operation.textContent = `${displayValue}`;
        } else {
            operation.textContent = `${firstOperand || ''} ${operator || ''} ${calculator.waitingForSecondOperand ? '' : displayValue}`;
        }
    }

    updateDisplay();

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        const { value } = target;

        if (!target.matches('button')) {
            return;
        }

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '=':
                handleOperator(value);
                break;
            case '.':
                inputDecimal(value);
                break;
            case 'all-clear':
                resetCalculator();
                break;
            default:
                if (Number.isInteger(parseFloat(value))) {
                    inputDigit(value);
                }
        }

        updateDisplay();
    });
});