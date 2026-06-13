/* ============================================================
   OquBot Block Programming IDE v2 — Core Logic
   Scratch-style blocks, fixed inputs, Python code generator
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. CUSTOM BLOCK DEFINITIONS (ALL FIXED)
// ──────────────────────────────────────────────────────────────

const OQUBOT_BLOCKS = [
    // ─── Robot Movement ───
    {
        type: 'oqubot_open_mouth',
        message0: 'открыть рот на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 45, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Открывает рот робота на указанный угол (0-180)',
    },
    {
        type: 'oqubot_close_mouth',
        message0: 'закрыть рот',
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Закрывает рот робота',
    },
    {
        type: 'oqubot_move_head',
        message0: 'повернуть голову на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Поворачивает голову робота (0=лево, 90=центр, 180=право)',
    },
    {
        type: 'oqubot_eye_vertical',
        message0: 'глаза вверх–вниз на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Поворачивает глаза по вертикали (серво вверх/вниз, 0-180)',
    },
    {
        type: 'oqubot_eye_horizontal',
        message0: 'глаза влево–вправо на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Поворачивает глаза по горизонтали (серво влево/вправо, 0-180)',
    },
    {
        type: 'oqubot_eyelid_top_left',
        message0: 'верхнее веко (левое) на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Управляет левым серво верхнего века (0-180)',
    },
    {
        type: 'oqubot_eyelid_top_right',
        message0: 'верхнее веко (правое) на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Управляет правым серво верхнего века (0-180)',
    },
    {
        type: 'oqubot_eyelid_bottom_left',
        message0: 'нижнее веко (левое) на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Управляет левым серво нижнего века (0-180)',
    },
    {
        type: 'oqubot_eyelid_bottom_right',
        message0: 'нижнее веко (правое) на %1 градусов',
        args0: [{ type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Управляет правым серво нижнего века (0-180)',
    },
    {
        type: 'oqubot_led',
        message0: 'светодиод %1',
        args0: [{
            type: 'field_dropdown',
            name: 'STATE',
            options: [['включить', 'ON'], ['выключить', 'OFF']],
        }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Включает или выключает светодиод на роботе',
    },

    // ─── Sound ───
    {
        type: 'oqubot_play_sound',
        message0: 'воспроизвести звук %1',
        args0: [{
            type: 'field_dropdown',
            name: 'SOUND',
            options: [
                ['приветствие', 'greeting'],
                ['успех', 'success'],
                ['ошибка', 'error'],
                ['загрузка', 'loading'],
                ['мелодия', 'melody'],
            ],
        }],
        previousStatement: null,
        nextStatement: null,
        colour: '#9966FF',
        tooltip: 'Воспроизводит встроенный звук робота',
    },
    {
        type: 'oqubot_set_volume',
        message0: 'установить громкость %1 %%',
        args0: [{ type: 'field_number', name: 'VOLUME', value: 50, min: 0, max: 100, precision: 1 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#9966FF',
        tooltip: 'Устанавливает громкость робота (0-100%)',
    },

    // ─── Speech ───
    {
        type: 'oqubot_say',
        message0: 'сказать %1',
        args0: [{ type: 'input_value', name: 'TEXT' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#CF63CF',
        tooltip: 'Робот произносит указанный текст вслух (TTS)',
    },
    {
        type: 'oqubot_ask',
        message0: 'спросить %1 и ждать ответ',
        args0: [{ type: 'input_value', name: 'TEXT' }],
        output: 'String',
        colour: '#CF63CF',
        tooltip: 'Робот задаёт вопрос и возвращает ответ пользователя',
    },
    {
        type: 'oqubot_listen',
        message0: 'слушать речь',
        output: 'String',
        colour: '#CF63CF',
        tooltip: 'Робот слушает и возвращает распознанный текст',
    },
    {
        type: 'oqubot_set_personality',
        message0: 'установить личность %1',
        args0: [{
            type: 'field_dropdown',
            name: 'PERSONA',
            options: [
                ['OquBot', 'default'],
                ['Абай Құнанбайұлы', 'abay'],
                ['Қаныш Сәтбаев', 'satpayev'],
                ['Ахмет Байтұрсынұлы', 'baitursynov'],
                ['Абылай хан', 'ablaykhan'],
                ['Мұхтар Әуезов', 'auezov'],
                ['Әлихан Бөкейханұлы', 'bokeikhanov'],
                ['Ыбырай Алтынсарин', 'altynsarin'],
                ['Бауыржан Момышұлы', 'momyshuly'],
                ['Міржақып Дулатов', 'dulatov'],
                ['Мұстафа Шоқай', 'shokay']
            ],
        }],
        previousStatement: null,
        nextStatement: null,
        colour: '#CF63CF',
        tooltip: 'Устанавливает личность для генерации ответов',
    },
    {
        type: 'oqubot_set_mode',
        message0: 'установить режим %1',
        args0: [{
            type: 'field_dropdown',
            name: 'MODE',
            options: [
                ['Диалог', 'Диалог'],
                ['Обучение', 'Обучение'],
                ['Сказка', 'Сказка'],
            ],
        }],
        previousStatement: null,
        nextStatement: null,
        colour: '#CF63CF',
        tooltip: 'Устанавливает режим диалога',
    },
    {
        type: 'oqubot_clear_memory',
        message0: 'очистить память диалога',
        previousStatement: null,
        nextStatement: null,
        colour: '#CF63CF',
        tooltip: 'Очищает историю диалога',
    },
    {
        type: 'oqubot_generate_response',
        message0: 'сгенерировать ответ на %1',
        args0: [{ type: 'input_value', name: 'TEXT' }],
        output: 'String',
        colour: '#CF63CF',
        tooltip: 'Генерирует ответ с учетом личности и истории',
    },
    {
        type: 'oqubot_listen_reply',
        message0: 'слушать и ответить',
        previousStatement: null,
        nextStatement: null,
        colour: '#CF63CF',
        tooltip: 'Слушает пользователя, генерирует ответ и озвучивает его',
    },

    // ─── Control ───
    {
        type: 'oqubot_wait',
        message0: 'ждать %1 секунд',
        args0: [{ type: 'input_value', name: 'SECONDS', check: 'Number' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Пауза на указанное количество секунд',
    },
    {
        type: 'oqubot_repeat',
        message0: 'повторить %1 раз',
        args0: [{ type: 'input_value', name: 'TIMES' }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Повторяет блоки внутри указанное число раз',
    },
    {
        type: 'oqubot_forever',
        message0: 'повторять всегда',
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Бесконечный цикл',
    },

    // ─── Logic ───
    {
        type: 'oqubot_if',
        message0: 'если %1 то',
        args0: [{ type: 'input_value', name: 'CONDITION' }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFBF00',
        tooltip: 'Выполняет блоки внутри, если условие истинно',
    },
    {
        type: 'oqubot_if_else',
        message0: 'если %1 то',
        args0: [{ type: 'input_value', name: 'CONDITION' }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        message2: 'иначе',
        message3: '%1',
        args3: [{ type: 'input_statement', name: 'ELSE' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFBF00',
        tooltip: 'Если условие истинно — первый блок, иначе — второй',
    },
    {
        type: 'oqubot_compare',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A' },
            {
                type: 'field_dropdown', name: 'OP',
                options: [['=', 'EQ'], ['\\u2260', 'NEQ'], ['<', 'LT'], ['>', 'GT'], ['\\u2264', 'LTE'], ['\\u2265', 'GTE']],
            },
            { type: 'input_value', name: 'B' },
        ],
        inputsInline: true,
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Сравнивает два значения',
    },
    {
        type: 'oqubot_logic_op',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A' },
            { type: 'field_dropdown', name: 'OP', options: [['и', 'AND'], ['или', 'OR']] },
            { type: 'input_value', name: 'B' },
        ],
        inputsInline: true,
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Логическое И / ИЛИ',
    },
    {
        type: 'oqubot_not',
        message0: 'не %1',
        args0: [{ type: 'input_value', name: 'BOOL' }],
        inputsInline: true,
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Логическое отрицание',
    },

    // ─── Math ───
    {
        type: 'oqubot_number',
        message0: '%1',
        args0: [{ type: 'field_number', name: 'NUM', value: 0 }],
        output: 'Number',
        colour: '#4C97FF',
        tooltip: 'Числовое значение',
    },
    {
        type: 'oqubot_math',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A' },
            {
                type: 'field_dropdown', name: 'OP',
                options: [['+', 'ADD'], ['\\u2212', 'SUB'], ['\\u00d7', 'MUL'], ['\\u00f7', 'DIV']],
            },
            { type: 'input_value', name: 'B' },
        ],
        inputsInline: true,
        output: 'Number',
        colour: '#4C97FF',
        tooltip: 'Арифметическая операция',
    },
    {
        type: 'oqubot_random',
        message0: 'случайное от %1 до %2',
        args0: [
            { type: 'field_number', name: 'FROM', value: 1 },
            { type: 'field_number', name: 'TO', value: 10 },
        ],
        output: 'Number',
        colour: '#4C97FF',
        tooltip: 'Случайное целое число в диапазоне',
    },

    // ─── Text ───
    {
        type: 'oqubot_text',
        message0: '%1',
        args0: [{ type: 'field_input', name: 'TEXT', text: 'Привет!' }],
        output: 'String',
        colour: '#FF8C1A',
        tooltip: 'Текстовое значение',
    },
    {
        type: 'oqubot_text_join',
        message0: 'соединить %1 и %2',
        args0: [
            { type: 'input_value', name: 'A' },
            { type: 'input_value', name: 'B' },
        ],
        inputsInline: true,
        output: 'String',
        colour: '#FF8C1A',
        tooltip: 'Соединяет два текста в один',
    },

    // ─── Variables ───
    {
        type: 'oqubot_var_set',
        message0: 'задать %1 = %2',
        args0: [
            { type: 'field_input', name: 'VAR', text: 'x' },
            { type: 'input_value', name: 'VALUE' },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: '#FF6680',
        tooltip: 'Создаёт переменную или присваивает ей значение',
    },
    {
        type: 'oqubot_var_get',
        message0: '%1',
        args0: [{ type: 'field_input', name: 'VAR', text: 'x' }],
        output: null,
        colour: '#FF6680',
        tooltip: 'Получить значение переменной',
    },

    // ─── Print / Debug ───
    {
        type: 'oqubot_print',
        message0: 'вывести %1',
        args0: [{ type: 'input_value', name: 'TEXT' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FF8C1A',
        tooltip: 'Выводит значение в консоль (для отладки)',
    },
];


// ──────────────────────────────────────────────────────────────
// 2. TOOLBOX WITH SHADOW BLOCKS
// ──────────────────────────────────────────────────────────────

function blockSimple(type) {
    return { kind: 'block', type: type };
}

function blockWithShadow(type, inputs) {
    return { kind: 'block', type: type, inputs: inputs };
}

function numShadow(value) {
    return { shadow: { type: 'oqubot_number', fields: { NUM: value } } };
}

function textShadow(value) {
    return { shadow: { type: 'oqubot_text', fields: { TEXT: value } } };
}

const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Робот',
            colour: '#4C97AF',
            cssConfig: { icon: 'oqu-ic oqu-ic--robot' },
            contents: [
                blockSimple('oqubot_open_mouth'),
                blockSimple('oqubot_close_mouth'),
                blockSimple('oqubot_move_head'),
                blockSimple('oqubot_eye_vertical'),
                blockSimple('oqubot_eye_horizontal'),
                blockSimple('oqubot_eyelid_top_left'),
                blockSimple('oqubot_eyelid_top_right'),
                blockSimple('oqubot_eyelid_bottom_left'),
                blockSimple('oqubot_eyelid_bottom_right'),
                blockSimple('oqubot_led'),
            ],
        },
        {
            kind: 'category',
            name: 'Звук',
            colour: '#9966FF',
            cssConfig: { icon: 'oqu-ic oqu-ic--sound' },
            contents: [
                blockSimple('oqubot_play_sound'),
                blockSimple('oqubot_set_volume'),
            ],
        },
        {
            kind: 'category',
            name: 'Речь',
            colour: '#CF63CF',
            cssConfig: { icon: 'oqu-ic oqu-ic--speech' },
            contents: [
                blockWithShadow('oqubot_say', { TEXT: textShadow('Привет, я OquBot!') }),
                blockWithShadow('oqubot_ask', { TEXT: textShadow('Как тебя зовут?') }),
                blockSimple('oqubot_listen'),
                blockSimple('oqubot_listen_reply'),
                blockWithShadow('oqubot_generate_response', { TEXT: textShadow('') }),
                blockSimple('oqubot_set_personality'),
                blockSimple('oqubot_set_mode'),
                blockSimple('oqubot_clear_memory'),
            ],
        },
        { kind: 'sep' },
        {
            kind: 'category',
            name: 'Управление',
            colour: '#FFAB19',
            cssConfig: { icon: 'oqu-ic oqu-ic--control' },
            contents: [
                blockWithShadow('oqubot_wait', { SECONDS: numShadow(1) }),
                blockWithShadow('oqubot_repeat', { TIMES: numShadow(3) }),
                blockSimple('oqubot_forever'),
            ],
        },
        {
            kind: 'category',
            name: 'Условия',
            colour: '#FFBF00',
            cssConfig: { icon: 'oqu-ic oqu-ic--logic' },
            contents: [
                blockSimple('oqubot_if'),
                blockSimple('oqubot_if_else'),
                blockWithShadow('oqubot_compare', {
                    A: numShadow(0),
                    B: numShadow(0),
                }),
                blockSimple('oqubot_logic_op'),
                blockSimple('oqubot_not'),
            ],
        },
        {
            kind: 'category',
            name: 'Математика',
            colour: '#4C97FF',
            cssConfig: { icon: 'oqu-ic oqu-ic--math' },
            contents: [
                blockSimple('oqubot_number'),
                blockWithShadow('oqubot_math', {
                    A: numShadow(0),
                    B: numShadow(0),
                }),
                blockSimple('oqubot_random'),
            ],
        },
        {
            kind: 'category',
            name: 'Текст',
            colour: '#FF8C1A',
            cssConfig: { icon: 'oqu-ic oqu-ic--text' },
            contents: [
                blockSimple('oqubot_text'),
                blockWithShadow('oqubot_text_join', {
                    A: textShadow('привет'),
                    B: textShadow(' мир'),
                }),
                blockWithShadow('oqubot_print', { TEXT: textShadow('hello') }),
            ],
        },
        {
            kind: 'category',
            name: 'Переменные',
            colour: '#FF6680',
            cssConfig: { icon: 'oqu-ic oqu-ic--var' },
            contents: [
                blockWithShadow('oqubot_var_set', { VALUE: numShadow(0) }),
                blockSimple('oqubot_var_get'),
            ],
        },
    ],
};


// ──────────────────────────────────────────────────────────────
// 3. PYTHON CODE GENERATOR
// ──────────────────────────────────────────────────────────────

let oquPython = null;

function initGenerator() {
    oquPython = new Blockly.Generator('OquPython');

    oquPython.ORDER_ATOMIC = 0;
    oquPython.ORDER_NONE = 99;
    oquPython.INDENT = '    ';

    // Chain sequential statements
    oquPython.scrub_ = function (block, code, thisOnly) {
        const next = block.nextConnection && block.nextConnection.targetBlock();
        if (next && !thisOnly) {
            return code + oquPython.blockToCode(next);
        }
        return code;
    };

    // ── Robot ──
    oquPython.forBlock['oqubot_open_mouth'] = function (block) {
        return 'robot.open_mouth(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_close_mouth'] = function () {
        return 'robot.close_mouth()\n';
    };
    oquPython.forBlock['oqubot_move_head'] = function (block) {
        return 'robot.move_head(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eye_vertical'] = function (block) {
        return 'robot.eye_vertical(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eye_horizontal'] = function (block) {
        return 'robot.eye_horizontal(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eyelid_top_left'] = function (block) {
        return 'robot.eyelid_top_left(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eyelid_top_right'] = function (block) {
        return 'robot.eyelid_top_right(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eyelid_bottom_left'] = function (block) {
        return 'robot.eyelid_bottom_left(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_eyelid_bottom_right'] = function (block) {
        return 'robot.eyelid_bottom_right(' + block.getFieldValue('ANGLE') + ')\n';
    };
    oquPython.forBlock['oqubot_led'] = function (block) {
        var s = block.getFieldValue('STATE');
        return 'robot.led(' + (s === 'ON' ? 'True' : 'False') + ')\n';
    };

    // ── Sound ──
    oquPython.forBlock['oqubot_play_sound'] = function (block) {
        return 'robot.play_sound("' + block.getFieldValue('SOUND') + '")\n';
    };
    oquPython.forBlock['oqubot_set_volume'] = function (block) {
        return 'robot.set_volume(' + block.getFieldValue('VOLUME') + ')\n';
    };

    // ── Speech ──
    oquPython.forBlock['oqubot_say'] = function (block, gen) {
        var text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return 'robot.say(' + text + ')\n';
    };
    oquPython.forBlock['oqubot_ask'] = function (block, gen) {
        var text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return ['robot.ask(' + text + ')', gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_listen'] = function (block, gen) {
        return ['robot.listen()', gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_listen_reply'] = function () {
        return 'robot.listen_and_reply()\n';
    };
    oquPython.forBlock['oqubot_generate_response'] = function (block, gen) {
        var text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return ['robot.generate_response(' + text + ')', gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_set_personality'] = function (block) {
        var persona = block.getFieldValue('PERSONA');
        return 'robot.set_personality("' + persona + '")\n';
    };
    oquPython.forBlock['oqubot_set_mode'] = function (block) {
        var mode = block.getFieldValue('MODE');
        return 'robot.set_mode("' + mode + '")\n';
    };
    oquPython.forBlock['oqubot_clear_memory'] = function () {
        return 'robot.clear_memory()\n';
    };

    // ── Control ──
    oquPython.forBlock['oqubot_wait'] = function (block, gen) {
        var secs = gen.valueToCode(block, 'SECONDS', gen.ORDER_ATOMIC) || '1';
        return 'robot.wait(' + secs + ')\n';
    };
    oquPython.forBlock['oqubot_repeat'] = function (block, gen) {
        var times = gen.valueToCode(block, 'TIMES', gen.ORDER_ATOMIC) || '3';
        var body = gen.statementToCode(block, 'DO') || (gen.INDENT + 'pass\n');
        return 'for i in range(' + times + '):\n' + body;
    };
    oquPython.forBlock['oqubot_forever'] = function (block, gen) {
        var body = gen.statementToCode(block, 'DO') || (gen.INDENT + 'pass\n');
        return 'while True:\n' + body;
    };

    // ── Logic ──
    oquPython.forBlock['oqubot_if'] = function (block, gen) {
        var cond = gen.valueToCode(block, 'CONDITION', gen.ORDER_ATOMIC) || 'True';
        var body = gen.statementToCode(block, 'DO') || (gen.INDENT + 'pass\n');
        return 'if ' + cond + ':\n' + body;
    };
    oquPython.forBlock['oqubot_if_else'] = function (block, gen) {
        var cond = gen.valueToCode(block, 'CONDITION', gen.ORDER_ATOMIC) || 'True';
        var doBody = gen.statementToCode(block, 'DO') || (gen.INDENT + 'pass\n');
        var elseBody = gen.statementToCode(block, 'ELSE') || (gen.INDENT + 'pass\n');
        return 'if ' + cond + ':\n' + doBody + 'else:\n' + elseBody;
    };
    oquPython.forBlock['oqubot_compare'] = function (block, gen) {
        var a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '0';
        var b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '0';
        var opMap = { EQ: '==', NEQ: '!=', LT: '<', GT: '>', LTE: '<=', GTE: '>=' };
        return [a + ' ' + opMap[block.getFieldValue('OP')] + ' ' + b, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_logic_op'] = function (block, gen) {
        var a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || 'True';
        var b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || 'True';
        var op = block.getFieldValue('OP') === 'AND' ? 'and' : 'or';
        return [a + ' ' + op + ' ' + b, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_not'] = function (block, gen) {
        var val = gen.valueToCode(block, 'BOOL', gen.ORDER_ATOMIC) || 'True';
        return ['not ' + val, gen.ORDER_ATOMIC];
    };

    // ── Math ──
    oquPython.forBlock['oqubot_number'] = function (block, gen) {
        return [String(block.getFieldValue('NUM')), gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_math'] = function (block, gen) {
        var a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '0';
        var b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '0';
        var opMap = { ADD: '+', SUB: '-', MUL: '*', DIV: '/' };
        return [a + ' ' + opMap[block.getFieldValue('OP')] + ' ' + b, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_random'] = function (block, gen) {
        return ['random.randint(' + block.getFieldValue('FROM') + ', ' + block.getFieldValue('TO') + ')', gen.ORDER_ATOMIC];
    };

    // ── Text ──
    oquPython.forBlock['oqubot_text'] = function (block, gen) {
        var text = block.getFieldValue('TEXT').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return ['"' + text + '"', gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_text_join'] = function (block, gen) {
        var a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '""';
        var b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '""';
        return [a + ' + ' + b, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_print'] = function (block, gen) {
        var text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return 'print(' + text + ')\n';
    };

    // ── Variables ──
    oquPython.forBlock['oqubot_var_set'] = function (block, gen) {
        var varName = block.getFieldValue('VAR');
        var val = gen.valueToCode(block, 'VALUE', gen.ORDER_ATOMIC) || '0';
        return varName + ' = ' + val + '\n';
    };
    oquPython.forBlock['oqubot_var_get'] = function (block, gen) {
        return [block.getFieldValue('VAR'), gen.ORDER_ATOMIC];
    };
}


// ──────────────────────────────────────────────────────────────
// 4. BLOCKLY THEME (SCRATCH-LIKE LIGHT)
// ──────────────────────────────────────────────────────────────

function createTheme() {
    return Blockly.Theme.defineTheme('oqubot_light', {
        base: Blockly.Themes.Classic,
        componentStyles: {
            workspaceBackgroundColour: '#FFFFFF',
            toolboxBackgroundColour: '#F1EADC',
            toolboxForegroundColour: '#5C574C',
            flyoutBackgroundColour: '#FFFFFF',
            flyoutForegroundColour: '#5C574C',
            flyoutOpacity: 1,
            scrollbarColour: '#CFC6B3',
            scrollbarOpacity: 0.6,
            insertionMarkerColour: '#F2B705',
            insertionMarkerOpacity: 0.5,
            cursorColour: '#F2B705',
        },
        fontStyle: {
            family: 'Nunito, sans-serif',
            weight: '700',
            size: 12,
        },
    });
}


// ──────────────────────────────────────────────────────────────
// 5. MAIN IDE CONTROLLER
// ──────────────────────────────────────────────────────────────

var OquIDE = {
    workspace: null,
    isRunning: false,
    isConnected: false,
    currentFile: null,

    // ── Initialize ──
    init: function () {
        // Register custom blocks
        Blockly.defineBlocksWithJsonArray(OQUBOT_BLOCKS);

        // Initialize code generator
        initGenerator();

        // Create workspace
        var theme = createTheme();
        this.workspace = Blockly.inject('blockly-div', {
            toolbox: TOOLBOX,
            theme: theme,
            grid: {
                spacing: 20,
                length: 2,
                colour: '#E7DFCF',
                snap: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.85,
                maxScale: 2,
                minScale: 0.3,
                scaleSpeed: 1.1,
                pinch: true,
            },
            trashcan: true,
            move: {
                scrollbars: { horizontal: true, vertical: true },
                drag: true,
                wheel: false,
            },
            sounds: false,
            renderer: 'zelos',
        });

        // Listen for workspace changes
        var self = this;
        this.workspace.addChangeListener(function (event) {
            if (event.type === Blockly.Events.BLOCK_MOVE ||
                event.type === Blockly.Events.BLOCK_CHANGE ||
                event.type === Blockly.Events.BLOCK_CREATE ||
                event.type === Blockly.Events.BLOCK_DELETE) {
                self.updateCode();
                self.updateBlockCount();
            }
            // 2-way binding for voice chat panel
            if (event.type === Blockly.Events.BLOCK_CHANGE) {
                var block = self.workspace.getBlockById(event.blockId);
                if (block && block.type === 'oqubot_set_personality') {
                    document.getElementById('voice-persona').value = block.getFieldValue('PERSONA');
                    localStorage.setItem('oqubot_voice_persona', block.getFieldValue('PERSONA'));
                }
                if (block && block.type === 'oqubot_set_mode') {
                    document.getElementById('voice-mode').value = block.getFieldValue('MODE');
                    localStorage.setItem('oqubot_voice_mode', block.getFieldValue('MODE'));
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', function () { self.resizeBlockly(); });
        this.resizeBlockly();

        // Setup resize handle for code panel
        this.setupResizeHandle();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup floating panel drag
        this.setupFloatingPanelDrag();

        // Load saved settings
        this.loadSettings();

        // Hide loading, show app
        setTimeout(function () {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('app').style.opacity = '1';
            document.getElementById('app').style.transition = 'opacity 0.4s ease';
            setTimeout(function () { Blockly.svgResize(self.workspace); }, 100);
        }, 600);

        console.log('[OquBot IDE] Initialized successfully');
    },

    // ── Resize Blockly to fit container ──
    resizeBlockly: function () {
        if (!this.workspace) return;
        var area = document.getElementById('blockly-area');
        var div = document.getElementById('blockly-div');
        div.style.width = area.offsetWidth + 'px';
        div.style.height = area.offsetHeight + 'px';
        Blockly.svgResize(this.workspace);
    },

    // ── Code Panel Resize Handle ──
    setupResizeHandle: function () {
        var handle = document.getElementById('resize-handle');
        var codePanel = document.getElementById('code-panel');
        var isDragging = false;
        var self = this;

        handle.addEventListener('mousedown', function (e) {
            isDragging = true;
            handle.classList.add('active');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            var newWidth = window.innerWidth - e.clientX;
            if (newWidth >= 220 && newWidth <= 600) {
                codePanel.style.width = newWidth + 'px';
                self.resizeBlockly();
            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                handle.classList.remove('active');
                document.body.style.cursor = '';
                self.resizeBlockly();
            }
        });
    },

    // ── Update generated code ──
    updateCode: function () {
        if (!oquPython || !this.workspace) return;
        try {
            var code = oquPython.workspaceToCode(this.workspace);
            var codeOutput = document.getElementById('code-output');

            if (!code || code.trim() === '') {
                codeOutput.innerHTML = '<span class="code-comment"># Перетащите блоки на рабочую область,\n# чтобы увидеть сгенерированный код</span>';
                return;
            }

            var imports = this.detectImports(code);
            var fullCode = '';
            if (imports.length > 0) {
                fullCode += imports.join('\n') + '\n\n';
            }
            fullCode += '# Подключение к роботу\n';
            fullCode += '# Программа\n';
            fullCode += code;

            codeOutput.innerHTML = this.highlightPython(fullCode);
        } catch (e) {
            console.error('[OquBot IDE] Code generation error:', e);
        }
    },

    detectImports: function (code) {
        var imports = ['import time'];
        if (code.indexOf('random.') !== -1) imports.push('import random');
        return imports;
    },

    highlightPython: function (code) {
        var html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = html.replace(/(#.*)/g, '<span class="code-comment">$1</span>');
        html = html.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="code-string">"$1"</span>');
        html = html.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, "<span class=\"code-string\">'$1'</span>");
        var keywords = ['import', 'from', 'def', 'class', 'if', 'else', 'elif',
            'for', 'while', 'in', 'range', 'True', 'False', 'None',
            'not', 'and', 'or', 'return', 'pass', 'break', 'continue'];
        keywords.forEach(function (kw) {
            html = html.replace(new RegExp('\\b(' + kw + ')\\b', 'g'), '<span class="code-keyword">$1</span>');
        });
        html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');
        html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="code-function">$1</span>(');
        return html;
    },

    updateBlockCount: function () {
        var count = this.workspace.getAllBlocks(false).length;
        document.getElementById('block-count').textContent = 'Blocks: ' + count;
    },

    // ── File Operations ──
    newProject: function () {
        if (this.workspace.getAllBlocks(false).length > 0) {
            if (!confirm('Создать новый проект? Несохранённые изменения будут потеряны.')) return;
        }
        this.workspace.clear();
        this.currentFile = null;
        this.updateCode();
        this.updateBlockCount();
        this.toast('Новый проект создан', 'info');
    },

    saveProject: function () {
        var data = Blockly.serialization.workspaces.save(this.workspace);
        var json = JSON.stringify(data, null, 2);

        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.save_project(json).then(function (result) {
                if (result) OquIDE.toast('Проект сохранён', 'success');
            });
        } else {
            var blob = new Blob([json], { type: 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'oqubot_project.json';
            a.click();
            URL.revokeObjectURL(a.href);
            this.toast('Проект скачан', 'success');
        }
    },

    saveProjectAs: function () {
        this.currentFile = null;
        this.saveProject();
    },

    openProject: function () {
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.open_project().then(function (result) {
                if (result) {
                    try {
                        var data = JSON.parse(result);
                        Blockly.serialization.workspaces.load(data, OquIDE.workspace);
                        OquIDE.updateCode();
                        OquIDE.updateBlockCount();
                        OquIDE.toast('Проект загружен', 'success');
                    } catch (e) {
                        OquIDE.toast('Ошибка загрузки проекта', 'error');
                    }
                }
            });
        } else {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function (e) {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (ev) {
                    try {
                        var data = JSON.parse(ev.target.result);
                        Blockly.serialization.workspaces.load(data, OquIDE.workspace);
                        OquIDE.updateCode();
                        OquIDE.updateBlockCount();
                        OquIDE.toast('Проект загружен', 'success');
                    } catch (err) {
                        OquIDE.toast('Ошибка загрузки', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }
    },

    exportCode: function () {
        if (!oquPython) return;
        var code = oquPython.workspaceToCode(this.workspace);
        if (!code.trim()) {
            this.toast('Нет блоков для экспорта', 'error');
            return;
        }
        var imports = this.detectImports(code);
        var fullCode = imports.join('\n') + '\n\n' + code;
        navigator.clipboard.writeText(fullCode).then(function () {
            OquIDE.toast('Код скопирован', 'success');
        });
    },

    // ── Edit Operations ──
    undo: function () { this.workspace.undo(false); },
    redo: function () { this.workspace.undo(true); },
    clearWorkspace: function () {
        if (this.workspace.getAllBlocks(false).length === 0) return;
        if (confirm('Удалить все блоки?')) {
            this.workspace.clear();
            this.updateCode();
            this.updateBlockCount();
            this.toast('Очищено', 'info');
        }
    },

    // ── Run / Stop ──
    runProgram: function () {
        if (!oquPython) return;
        var code = oquPython.workspaceToCode(this.workspace);
        if (!code.trim()) {
            this.toast('Добавьте блоки перед запуском', 'error');
            return;
        }
        this.isRunning = true;
        document.getElementById('btn-run').classList.add('action-btn--disabled');
        document.getElementById('btn-stop').classList.remove('action-btn--disabled');

        if (window.pywebview && window.pywebview.api) {
            var imports = this.detectImports(code);
            var fullCode = imports.join('\n') + '\n\n' + code;
            window.pywebview.api.run_code(fullCode).then(function (result) {
                // Do nothing, python thread will call OquIDE.stopProgram() when it finishes
            });
        } else {
            this.toast('Program started (demo)', 'info');
            var self = this;
            setTimeout(function () { self.stopProgram(); }, 2000);
        }
    },

    stopProgram: function () {
        this.isRunning = false;
        document.getElementById('btn-run').classList.remove('action-btn--disabled');
        document.getElementById('btn-stop').classList.add('action-btn--disabled');
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.stop_code();
        }
    },

    // ── Connect Robot (USB Serial) ──
    setConnectedUI: function (connected, label) {
        this.isConnected = connected;
        var dot = document.getElementById('status-dot');
        var text = document.getElementById('status-text');
        var btn = document.getElementById('btn-connect');
        if (connected) {
            dot.classList.add('status-dot--connected');
            text.textContent = label || 'Подключён';
            if (btn) { btn.classList.add('active'); btn.lastChild.textContent = ' Робот подключён'; }
        } else {
            dot.classList.remove('status-dot--connected');
            text.textContent = 'Не подключён';
            if (btn) { btn.classList.remove('active'); btn.lastChild.textContent = ' Подключить робота'; }
        }
    },

    connectRobot: function () {
        // Если уже подключены — отключаемся
        if (this.isConnected) {
            if (window.pywebview && window.pywebview.api) {
                window.pywebview.api.disconnect_robot();
            }
            this.setConnectedUI(false);
            this.toast('Робот отключён', 'info');
            return;
        }

        if (window.pywebview && window.pywebview.api) {
            this.toast('Поиск робота...', 'info');
            window.pywebview.api.connect_robot().then(function (result) {
                if (result && result.success) {
                    OquIDE.setConnectedUI(true, result.port || 'Подключён');
                    OquIDE.toast('Робот подключён!', 'success');
                } else {
                    OquIDE.toast('Робот не найден', 'error');
                }
            });
        } else {
            this.setConnectedUI(true, 'COM3 (демо)');
            this.toast('Робот подключён (демо)', 'success');
        }
    },

    // ── Code Panel ──
    toggleCodePanel: function () {
        var panel = document.getElementById('code-panel');
        panel.classList.toggle('collapsed');
        var self = this;
        setTimeout(function () { self.resizeBlockly(); }, 300);
    },

    copyCode: function () {
        var el = document.getElementById('code-output');
        var text = el.innerText || el.textContent;
        navigator.clipboard.writeText(text).then(function () {
            OquIDE.toast('Code copied', 'success');
        });
    },

    // ── Settings ──
    showSettings: function () {
        document.getElementById('settings-modal').classList.add('active');
    },
    showAbout: function () {
        document.getElementById('about-modal').classList.add('active');
    },
    showKeyboardShortcuts: function () {
        document.getElementById('shortcuts-modal').classList.add('active');
    },
    openModal: function (id) {
        document.getElementById(id).classList.add('active');
    },

    closeModal: function (id) {
        document.getElementById(id).classList.remove('active');
    },
    
    toggleVoicePanel: function () {
        var panel = document.getElementById('voice-floating-panel');
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    },
    
    setupFloatingPanelDrag: function () {
        var header = document.getElementById('voice-panel-header');
        var panel = document.getElementById('voice-floating-panel');
        if (!header || !panel) return;
        
        var isDragging = false;
        var startX, startY, initialX, initialY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName.toLowerCase() === 'button') return;
            isDragging = true;
            var rect = panel.getBoundingClientRect();
            // Store current position
            initialX = rect.left;
            initialY = rect.top;
            startX = e.clientX;
            startY = e.clientY;
            
            // Remove fixed bottom/right so it moves freely
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
            panel.style.left = initialX + 'px';
            panel.style.top = initialY + 'px';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            panel.style.left = (initialX + dx) + 'px';
            panel.style.top = (initialY + dy) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    },

    setLanguage: function (lang) {
        localStorage.setItem('oqubot_language', lang);
        this.toast('Language will apply on restart', 'info');
    },

    setCodeFontSize: function (size) {
        document.getElementById('code-output').style.fontSize = size + 'px';
        localStorage.setItem('oqubot_code_font_size', size);
    },

    // ── API Keys ──
    saveApiKeys: function () {
        var groqKey = document.getElementById('setting-groq-key').value;
        var elevenKey = document.getElementById('setting-elevenlabs-key').value;

        // Send to Python backend to save to .env
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.set_api_keys(groqKey, elevenKey);
            this.toast('API Ключи сохранены в .env', 'success');
        } else {
            // Fallback for local browser testing
            localStorage.setItem('oqubot_groq_key', groqKey);
            localStorage.setItem('oqubot_elevenlabs_key', elevenKey);
            this.toast('API Ключи сохранены локально', 'success');
        }
    },

    testApiKeys: function () {
        var groqKey = document.getElementById('setting-groq-key').value;
        var elevenKey = document.getElementById('setting-elevenlabs-key').value;

        if (!groqKey && !elevenKey) {
            this.toast('Enter at least one key', 'error');
            return;
        }

        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.test_api_keys(groqKey, elevenKey).then(function (result) {
                if (result && result.success) {
                    OquIDE.toast('Keys verified!', 'success');
                } else {
                    OquIDE.toast('Key error: ' + (result ? result.error : 'unknown'), 'error');
                }
            });
        } else {
            if (groqKey) this.toast('Groq key saved (demo)', 'success');
            if (elevenKey) this.toast('ElevenLabs key saved (demo)', 'success');
        }
    },

    // ── Examples & Voice Chat ──
    loadExample: function(type) {
        var xmlString = '';
        if (type === 'greeting') {
            xmlString = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="oqubot_say" x="50" y="50"><value name="TEXT"><shadow type="oqubot_text"><field name="TEXT">Привет! Я Окубот!</field></shadow></value><next><block type="oqubot_move_head"><field name="ANGLE">90</field></block></next></block></xml>';
        } else if (type === 'emotions') {
            xmlString = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="oqubot_forever" x="50" y="50"><statement name="DO"><block type="oqubot_open_mouth"><field name="ANGLE">45</field><next><block type="oqubot_wait"><value name="SECONDS"><shadow type="oqubot_number"><field name="NUM">1</field></shadow></value><next><block type="oqubot_close_mouth"><next><block type="oqubot_wait"><value name="SECONDS"><shadow type="oqubot_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></statement></block></xml>';
        } else if (type === 'logic') {
            xmlString = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="oqubot_if" x="50" y="50"><value name="CONDITION"><block type="oqubot_compare"><field name="OP">EQ</field><value name="A"><shadow type="oqubot_number"><field name="NUM">1</field></shadow></value><value name="B"><shadow type="oqubot_number"><field name="NUM">1</field></shadow></value></block></value><statement name="DO"><block type="oqubot_say"><value name="TEXT"><shadow type="oqubot_text"><field name="TEXT">Один равно один!</field></shadow></value></block></statement></block></xml>';
        }
        if (xmlString) {
            this.workspace.clear();
            var dom = Blockly.utils.xml.textToDom(xmlString);
            Blockly.Xml.domToWorkspace(dom, this.workspace);
            this.toast('Пример загружен', 'success');
        }
    },

    loadVoiceChatTemplate: function() {
        var xmlString = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="oqubot_set_personality" x="50" y="50"><field name="PERSONA">default</field><next><block type="oqubot_set_mode"><field name="MODE">Диалог</field><next><block type="oqubot_forever"><statement name="DO"><block type="oqubot_listen_reply"></block></statement></block></next></block></next></block></xml>';
        this.workspace.clear();
        var dom = Blockly.utils.xml.textToDom(xmlString);
        Blockly.Xml.domToWorkspace(dom, this.workspace);
        this.toast('Шаблон Голосового Чата загружен', 'success');
    },

    toggleVoiceRecord: function() {
        var btn = document.getElementById('btn-voice-record');
        var status = document.getElementById('voice-status-text');
        
        // If the block program is not running, let's inject the template and run it!
        if (!OquIDE.isRunning) {
            var blocks = OquIDE.workspace.getAllBlocks(false);
            if (blocks.length === 0) {
                OquIDE.loadVoiceChatTemplate();
            }
            OquIDE.runProgram();
            status.textContent = 'Запуск...';
            
            // Auto start recording after a short delay to let python catch up
            setTimeout(function() {
                OquIDE.toggleVoiceRecord();
            }, 500);
            return;
        }

        if (btn.classList.contains('recording')) {
            // Остановка
            btn.classList.remove('recording');
            btn.style.animation = 'none';
            btn.style.background = '#EC5959';
            status.textContent = 'Обработка...';
            
            if (window.pywebview && window.pywebview.api) {
                window.pywebview.api.stop_voice_recording();
            }
        } else {
            // Старт
            btn.classList.add('recording');
            btn.style.animation = 'pulse-dot 1.5s infinite';
            btn.style.background = '#4CBF56';
            status.textContent = 'Слушаю...';
            
            if (window.pywebview && window.pywebview.api) {
                window.pywebview.api.start_voice_recording();
            }
        }
    },
    
    onVoiceSettingChange: function() {
        var persona = document.getElementById('voice-persona').value;
        var mode = document.getElementById('voice-mode').value;
        
        localStorage.setItem('oqubot_voice_persona', persona);
        localStorage.setItem('oqubot_voice_mode', mode);
        
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.live_update_voice_settings(persona, mode);
        }
        
        var blocks = OquIDE.workspace.getAllBlocks(false);
        blocks.forEach(function(b) {
            if (b.type === 'oqubot_set_personality') {
                try { b.setFieldValue(persona, 'PERSONA'); } catch(e){}
            }
            if (b.type === 'oqubot_set_mode') {
                try { b.setFieldValue(mode, 'MODE'); } catch(e){}
            }
        });
    },
    
    addVoiceMessage: function(sender, text, type) {
        var log = document.getElementById('voice-chat-log');
        var div = document.createElement('div');
        div.style.padding = '10px 14px';
        div.style.borderRadius = '8px';
        div.style.maxWidth = '80%';
        div.style.fontSize = '13px';
        div.style.lineHeight = '1.4';
        
        if (type === 'user') {
            div.style.background = 'rgba(242, 183, 5, 0.16)';
            div.style.color = '#2C2A26';
            div.style.alignSelf = 'flex-end';
            div.innerHTML = '<b>Вы:</b><br>' + text;
        } else {
            div.style.background = '#F1EADC';
            div.style.color = '#2C2A26';
            div.style.alignSelf = 'flex-start';
            div.innerHTML = '<b>Робот:</b><br>' + text;
        }
        
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    },

    // ── Keyboard Shortcuts ──
    setupKeyboardShortcuts: function () {
        var self = this;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
                    m.classList.remove('active');
                });
                return;
            }
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'n': e.preventDefault(); self.newProject(); break;
                    case 'o': e.preventDefault(); self.openProject(); break;
                    case 's':
                        e.preventDefault();
                        if (e.shiftKey) self.saveProjectAs();
                        else self.saveProject();
                        break;
                }
            }
            if (e.key === 'F5') {
                e.preventDefault();
                if (e.shiftKey) self.stopProgram();
                else self.runProgram();
            }
        });
    },

    // ── Toast Notifications ──
    toast: function (message, type) {
        type = type || 'info';
        var container = document.getElementById('toast-container');
        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        var icons = { success: '\u2705', error: '\u274c', info: '\u2139\ufe0f' };
        toast.textContent = (icons[type] || '') + ' ' + message;
        container.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add('show'); });
        setTimeout(function () {
            toast.style.animation = 'toast-out 0.3s ease forwards';
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    },

    // ── Load saved settings ──
    loadSettings: function () {
        var fontSize = localStorage.getItem('oqubot_code_font_size');
        if (fontSize) {
            document.getElementById('code-output').style.fontSize = fontSize + 'px';
            var sel = document.getElementById('setting-font-size');
            if (sel) sel.value = fontSize;
        }
        var lang = localStorage.getItem('oqubot_language');
        if (lang) {
            var sel2 = document.getElementById('setting-language');
            if (sel2) sel2.value = lang;
        }

        // Load API Keys from python backend
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.get_api_keys().then(function(keys) {
                if (keys.groq) {
                    document.getElementById('setting-groq-key').value = keys.groq;
                }
                if (keys.elevenlabs) {
                    document.getElementById('setting-elevenlabs-key').value = keys.elevenlabs;
                }
            });
        } else {
            var groqKey = localStorage.getItem('oqubot_groq_key');
            if (groqKey) {
                document.getElementById('setting-groq-key').value = groqKey;
            }
            var elevenKey = localStorage.getItem('oqubot_elevenlabs_key');
            if (elevenKey) {
                document.getElementById('setting-elevenlabs-key').value = elevenKey;
            }
        }
    },
};


// ──────────────────────────────────────────────────────────────
// 6. BOOT
// ──────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', function () {
    try {
        OquIDE.init();
    } catch (e) {
        console.error('[OquBot IDE] Init failed:', e);
        document.getElementById('loading-screen').innerHTML =
            '<div class="loading-logo">OquBot IDE</div>' +
            '<div style="color:#EC5959; margin-top:16px;">Error: ' + e.message + '</div>';
    }
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

window.addEventListener('pywebviewready', function () {
    if (window.pywebview && window.pywebview.api) {
        window.pywebview.api.get_personalities().then(function (res) {
            var select = document.getElementById('voice-persona');
            if (select && res) {
                select.innerHTML = '';
                for (var key in res) {
                    var option = document.createElement('option');
                    option.value = key;
                    option.textContent = res[key];
                    select.appendChild(option);
                }
                
                var savedPersona = localStorage.getItem('oqubot_voice_persona');
                if (savedPersona && res[savedPersona]) {
                    select.value = savedPersona;
                }
                
                var savedMode = localStorage.getItem('oqubot_voice_mode');
                if (savedMode) {
                    var mSelect = document.getElementById('voice-mode');
                    if (mSelect) mSelect.value = savedMode;
                }
            }
        });
    }
});
