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
        type: 'oqubot_blink',
        message0: 'моргнуть',
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Робот моргает глазами один раз',
    },
    {
        type: 'oqubot_move_eyes',
        message0: 'двигать глаза %1',
        args0: [{
            type: 'field_dropdown',
            name: 'DIRECTION',
            options: [
                ['влево', 'LEFT'],
                ['вправо', 'RIGHT'],
                ['по центру', 'CENTER'],
            ],
        }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Перемещает глаза робота в указанном направлении',
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
            contents: [
                blockSimple('oqubot_open_mouth'),
                blockSimple('oqubot_close_mouth'),
                blockSimple('oqubot_move_head'),
                blockSimple('oqubot_blink'),
                blockSimple('oqubot_move_eyes'),
                blockSimple('oqubot_led'),
            ],
        },
        {
            kind: 'category',
            name: 'Звук',
            colour: '#9966FF',
            contents: [
                blockSimple('oqubot_play_sound'),
                blockSimple('oqubot_set_volume'),
            ],
        },
        {
            kind: 'category',
            name: 'Речь',
            colour: '#CF63CF',
            contents: [
                blockWithShadow('oqubot_say', { TEXT: textShadow('Привет, я OquBot!') }),
                blockWithShadow('oqubot_ask', { TEXT: textShadow('Как тебя зовут?') }),
                blockSimple('oqubot_listen'),
            ],
        },
        { kind: 'sep' },
        {
            kind: 'category',
            name: 'Управление',
            colour: '#FFAB19',
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
    oquPython.forBlock['oqubot_blink'] = function () {
        return 'robot.blink()\n';
    };
    oquPython.forBlock['oqubot_move_eyes'] = function (block) {
        var dir = block.getFieldValue('DIRECTION');
        var m = { LEFT: '"left"', RIGHT: '"right"', CENTER: '"center"' };
        return 'robot.move_eyes(' + m[dir] + ')\n';
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
            toolboxBackgroundColour: '#F9F9F9',
            toolboxForegroundColour: '#575E75',
            flyoutBackgroundColour: '#F9F9F9',
            flyoutForegroundColour: '#575E75',
            flyoutOpacity: 0.95,
            scrollbarColour: '#CCCCCC',
            scrollbarOpacity: 0.6,
            insertionMarkerColour: '#855CD6',
            insertionMarkerOpacity: 0.4,
            cursorColour: '#855CD6',
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
                colour: '#E8E8E8',
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
        });

        // Handle window resize
        window.addEventListener('resize', function () { self.resizeBlockly(); });
        this.resizeBlockly();

        // Setup resize handle for code panel
        this.setupResizeHandle();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

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
            fullCode += 'robot = oqubot.connect()\n\n';
            fullCode += '# Программа\n';
            fullCode += code;

            codeOutput.innerHTML = this.highlightPython(fullCode);
        } catch (e) {
            console.error('[OquBot IDE] Code generation error:', e);
        }
    },

    detectImports: function (code) {
        var imports = ['import oqubot'];
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
        var fullCode = imports.join('\n') + '\n\nrobot = oqubot.connect()\n\n' + code;
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
            var fullCode = imports.join('\n') + '\n\nrobot = oqubot.connect()\n\n' + code;
            window.pywebview.api.run_code(fullCode).then(function (result) {
                OquIDE.toast(result || 'Done', 'success');
                OquIDE.stopProgram();
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
    connectRobot: function () {
        if (window.pywebview && window.pywebview.api) {
            this.toast('Searching for robot...', 'info');
            window.pywebview.api.connect_robot().then(function (result) {
                if (result && result.success) {
                    OquIDE.isConnected = true;
                    document.getElementById('status-dot').classList.add('status-dot--connected');
                    document.getElementById('status-text').textContent = result.port || 'Connected';
                    OquIDE.toast('Robot connected!', 'success');
                } else {
                    OquIDE.toast('Robot not found', 'error');
                }
            });
        } else {
            this.isConnected = !this.isConnected;
            var dot = document.getElementById('status-dot');
            var text = document.getElementById('status-text');
            if (this.isConnected) {
                dot.classList.add('status-dot--connected');
                text.textContent = 'COM3 (demo)';
                this.toast('Robot connected (demo)', 'success');
            } else {
                dot.classList.remove('status-dot--connected');
                text.textContent = 'Not connected';
                this.toast('Disconnected', 'info');
            }
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
        localStorage.setItem('oqubot_groq_key', groqKey);
        localStorage.setItem('oqubot_elevenlabs_key', elevenKey);

        // Send to Python backend if available
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.set_api_keys(groqKey, elevenKey);
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

    toggleVoiceRecord: function() {
        var btn = document.getElementById('btn-voice-record');
        var status = document.getElementById('voice-status-text');
        
        if (btn.classList.contains('recording')) {
            // Остановка
            btn.classList.remove('recording');
            btn.style.animation = 'none';
            btn.style.background = '#EC5959';
            status.textContent = 'Обработка...';
            this.addVoiceMessage('Вы', '(запись завершена)', 'user');
            
            var persona = document.getElementById('voice-persona').value;
            var mode = document.getElementById('voice-mode').value;
            
            if (window.pywebview && window.pywebview.api) {
                window.pywebview.api.stop_voice_recording(persona, mode).then(function(res) {
                    if(res && res.text) {
                        OquIDE.addVoiceMessage('Робот', res.text, 'bot');
                        status.textContent = 'Готов';
                    } else {
                        status.textContent = 'Ошибка';
                    }
                });
            } else {
                setTimeout(() => {
                    this.addVoiceMessage('Робот', 'Демо ответ: Я вас понял.', 'bot');
                    status.textContent = 'Готов';
                }, 1000);
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
    
    addVoiceMessage: function(sender, text, type) {
        var log = document.getElementById('voice-chat-log');
        var div = document.createElement('div');
        div.style.padding = '10px 14px';
        div.style.borderRadius = '8px';
        div.style.maxWidth = '80%';
        div.style.fontSize = '13px';
        div.style.lineHeight = '1.4';
        
        if (type === 'user') {
            div.style.background = '#E8E0F4';
            div.style.color = '#575E75';
            div.style.alignSelf = 'flex-end';
            div.innerHTML = '<b>Вы:</b><br>' + text;
        } else {
            div.style.background = '#F0F0F0';
            div.style.color = '#575E75';
            div.style.alignSelf = 'flex-start';
            div.innerHTML = '<b>🤖 Робот:</b><br>' + text;
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
        var groqKey = localStorage.getItem('oqubot_groq_key');
        if (groqKey) {
            document.getElementById('setting-groq-key').value = groqKey;
        }
        var elevenKey = localStorage.getItem('oqubot_elevenlabs_key');
        if (elevenKey) {
            document.getElementById('setting-elevenlabs-key').value = elevenKey;
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
