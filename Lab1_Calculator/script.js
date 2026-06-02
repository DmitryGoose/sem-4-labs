// Ждём полной загрузки DOM
window.onload = function () {
    // ---------- ПЕРЕМЕННЫЕ СОСТОЯНИЯ ----------
    let a = '';                 // первое число (строка)
    let b = '';                 // второе число (строка)
    let expressionResult = '';  // результат вычисления (число в строке)
    let selectedOperation = null; // текущая операция ('+', '-', 'x', '/')

    // ---------- ДОСТУП К ЭЛЕМЕНТАМ ----------
    const outputElement = document.getElementById('result');

    // Все кнопки с цифрами и точкой (id начинается с "btn_digit_")
    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    // ---------- ФУНКЦИЯ ОБРАБОТКИ ЦИФР И ТОЧКИ ----------
    function onDigitButtonClicked(digit) {
        // Если операция ещё не выбрана → работаем с числом a
        if (!selectedOperation) {
            // Запрещаем вторую точку в числе
            if (digit !== '.' || (digit === '.' && !a.includes('.'))) {
                a += digit;
            }
            outputElement.innerHTML = a || '0'; // если a пусто, показываем 0
        }
        // Иначе работаем со вторым числом b
        else {
            if (digit !== '.' || (digit === '.' && !b.includes('.'))) {
                b += digit;
                outputElement.innerHTML = b;
            }
        }
    }

    // ---------- НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ НА ЦИФРЫ ----------
    digitButtons.forEach(button => {
        button.onclick = function () {
            const digitValue = button.innerHTML; // текст на кнопке (0-9 или .)
            onDigitButtonClicked(digitValue);
        };
    });

    // ---------- КНОПКИ ОПЕРАЦИЙ (сохраняем операцию) ----------
    document.getElementById('btn_op_mult').onclick = function () {
        if (a === '') return;
        selectedOperation = 'x';
    };
    document.getElementById('btn_op_plus').onclick = function () {
        if (a === '') return;
        selectedOperation = '+';
    };
    document.getElementById('btn_op_minus').onclick = function () {
        if (a === '') return;
        selectedOperation = '-';
    };
    document.getElementById('btn_op_div').onclick = function () {
        if (a === '') return;
        selectedOperation = '/';
    };

    // ---------- КНОПКА СМЕНЫ ЗНАКА (+/-) ----------
    document.getElementById('btn_op_sign').onclick = function () {
        if (!selectedOperation) {
            // Меняем знак у первого числа
            if (a !== '') {
                a = (parseFloat(a) * -1).toString();
                outputElement.innerHTML = a;
            }
        } else {
            // Меняем знак у второго числа
            if (b !== '') {
                b = (parseFloat(b) * -1).toString();
                outputElement.innerHTML = b;
            }
        }
    };

    // ---------- КНОПКА ПРОЦЕНТА (%) ----------
    document.getElementById('btn_op_percent').onclick = function () {
        if (!selectedOperation && a !== '') {
            // Процент от первого числа (делим на 100)
            a = (parseFloat(a) / 100).toString();
            outputElement.innerHTML = a;
        } else if (selectedOperation && b !== '') {
            // Процент от второго числа
            b = (parseFloat(b) / 100).toString();
            outputElement.innerHTML = b;
        }
    };

    // ---------- КНОПКА ОЧИСТКИ (C) ----------
    document.getElementById('btn_op_clear').onclick = function () {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        outputElement.innerHTML = '0';
    };

    // ---------- КНОПКА РАВНО (=) ----------
    document.getElementById('btn_op_equal').onclick = function () {
        // Если нет второго числа или операции – выходим
        if (a === '' || b === '' || !selectedOperation) return;

        const numA = parseFloat(a);
        const numB = parseFloat(b);

        // Выполняем операцию
        switch (selectedOperation) {
            case 'x':
                expressionResult = numA * numB;
                break;
            case '+':
                expressionResult = numA + numB;
                break;
            case '-':
                expressionResult = numA - numB;
                break;
            case '/':
                if (numB == 0) {
                    expressionResult = 'ERROR';
                }
                else {
                    expressionResult = numA / numB;
                }
                if (expressionResult === 'ERROR') {
                    outputElement.innerHTML = 'ERROR';
                    a = '';
                    b = '';
                    selectedOperation = null;
                    return;
                }
                break;
            default:
                return;
        }

        // Преобразуем результат в строку и сохраняем как a для дальнейших вычислений
                // --- ФОРМАТИРОВАНИЕ РЕЗУЛЬТАТА ПЕРЕД ВЫВОДОМ ---
        // 1. Превращаем результат в число (на всякий случай)
        let resultNumber = parseFloat(expressionResult);

        // 2. Проверяем, является ли число целым
        if (Number.isInteger(resultNumber)) {
            // Целое число – выводим как есть
            a = resultNumber.toString();
        }
        else {
            // Дробное число – округляем до 8 знаков после запятой
            // и удаляем незначащие нули в конце с помощью parseFloat
            a = parseFloat(resultNumber.toFixed(10)).toString();
        }

        // Если результат настолько огромен, что даже после форматирования не влезает,
        // можно применить toExponential, но в нашем калькуляторе это маловероятно.

        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
};
}
