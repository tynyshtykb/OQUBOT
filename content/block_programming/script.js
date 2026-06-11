/* ============================================================
   OquBot Block Programming IDE — Core Logic
   Custom Blockly blocks, Python code generator, workspace mgmt
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. CUSTOM BLOCK DEFINITIONS
// ──────────────────────────────────────────────────────────────

const OQUBOT_BLOCKS = [
    // ─── Robot Movement ───
    {
        type: 'oqubot_open_mouth',
        message0: '🤖 Открыть рот на %1 градусов',
        args0: [{ type: 'field_angle', name: 'ANGLE', angle: 45 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Открывает рот робота на указанный угол (0-180)',
    },
    {
        type: 'oqubot_close_mouth',
        message0: '🤖 Закрыть рот',
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Закрывает рот робота',
    },
    {
        type: 'oqubot_move_head',
        message0: '🤖 Повернуть голову на %1 градусов',
        args0: [{ type: 'field_angle', name: 'ANGLE', angle: 90 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Поворачивает голову робота (0=лево, 90=центр, 180=право)',
    },
    {
        type: 'oqubot_blink',
        message0: '🤖 Моргнуть',
        previousStatement: null,
        nextStatement: null,
        colour: '#4C97AF',
        tooltip: 'Робот моргает глазами один раз',
    },
    {
        type: 'oqubot_move_eyes',
        message0: '🤖 Двигать глаза %1',
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
        message0: '💡 Светодиод %1',
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
        message0: '🔊 Воспроизвести звук %1',
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
        message0: '🔊 Установить громкость %1 %%',
        args0: [{ type: 'field_number', name: 'VOLUME', value: 50, min: 0, max: 100 }],
        previousStatement: null,
        nextStatement: null,
        colour: '#9966FF',
        tooltip: 'Устанавливает громкость робота (0-100%)',
    },

    // ─── Speech ───
    {
        type: 'oqubot_say',
        message0: '💬 Сказать %1',
        args0: [{ type: 'input_value', name: 'TEXT', check: 'String' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FF6680',
        tooltip: 'Робот произносит указанный текст вслух (TTS)',
    },
    {
        type: 'oqubot_ask',
        message0: '💬 Спросить %1 и ждать ответ',
        args0: [{ type: 'input_value', name: 'TEXT', check: 'String' }],
        output: 'String',
        colour: '#FF6680',
        tooltip: 'Робот задаёт вопрос и возвращает ответ пользователя',
    },
    {
        type: 'oqubot_listen',
        message0: '🎤 Слушать речь',
        output: 'String',
        colour: '#FF6680',
        tooltip: 'Робот слушает и возвращает распознанный текст',
    },

    // ─── Control ───
    {
        type: 'oqubot_wait',
        message0: '⏱ Ждать %1 секунд',
        args0: [{ type: 'input_value', name: 'SECONDS', check: 'Number' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Пауза на указанное количество секунд',
    },
    {
        type: 'oqubot_repeat',
        message0: '🔁 Повторить %1 раз',
        args0: [{ type: 'input_value', name: 'TIMES', check: 'Number' }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Повторяет блоки внутри указанное число раз',
    },
    {
        type: 'oqubot_forever',
        message0: '🔁 Повторять всегда',
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FFAB19',
        tooltip: 'Бесконечный цикл — повторяет блоки внутри бесконечно',
    },

    // ─── Logic ───
    {
        type: 'oqubot_if',
        message0: '❓ Если %1',
        args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }],
        message1: 'тогда %1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#59C059',
        tooltip: 'Выполняет блоки внутри, если условие истинно',
    },
    {
        type: 'oqubot_if_else',
        message0: '❓ Если %1',
        args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }],
        message1: 'тогда %1',
        args1: [{ type: 'input_statement', name: 'DO' }],
        message2: 'иначе %1',
        args2: [{ type: 'input_statement', name: 'ELSE' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#59C059',
        tooltip: 'Выполняет одну группу блоков, если условие истинно, и другую — если нет',
    },
    {
        type: 'oqubot_compare',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A' },
            {
                type: 'field_dropdown', name: 'OP',
                options: [['=', 'EQ'], ['≠', 'NEQ'], ['<', 'LT'], ['>', 'GT'], ['≤', 'LTE'], ['≥', 'GTE']],
            },
            { type: 'input_value', name: 'B' },
        ],
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Сравнивает два значения',
    },
    {
        type: 'oqubot_logic_op',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A', check: 'Boolean' },
            { type: 'field_dropdown', name: 'OP', options: [['и', 'AND'], ['или', 'OR']] },
            { type: 'input_value', name: 'B', check: 'Boolean' },
        ],
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Логическое И / ИЛИ',
    },
    {
        type: 'oqubot_not',
        message0: 'не %1',
        args0: [{ type: 'input_value', name: 'BOOL', check: 'Boolean' }],
        output: 'Boolean',
        colour: '#59C059',
        tooltip: 'Логическое отрицание (НЕ)',
    },

    // ─── Math ───
    {
        type: 'oqubot_number',
        message0: '%1',
        args0: [{ type: 'field_number', name: 'NUM', value: 0 }],
        output: 'Number',
        colour: '#5CB1D6',
        tooltip: 'Числовое значение',
    },
    {
        type: 'oqubot_math',
        message0: '%1 %2 %3',
        args0: [
            { type: 'input_value', name: 'A', check: 'Number' },
            {
                type: 'field_dropdown', name: 'OP',
                options: [['+', 'ADD'], ['−', 'SUB'], ['×', 'MUL'], ['÷', 'DIV']],
            },
            { type: 'input_value', name: 'B', check: 'Number' },
        ],
        output: 'Number',
        colour: '#5CB1D6',
        tooltip: 'Арифметическая операция',
    },
    {
        type: 'oqubot_random',
        message0: '🎲 случайное от %1 до %2',
        args0: [
            { type: 'field_number', name: 'FROM', value: 1 },
            { type: 'field_number', name: 'TO', value: 10 },
        ],
        output: 'Number',
        colour: '#5CB1D6',
        tooltip: 'Случайное целое число в диапазоне',
    },

    // ─── Text ───
    {
        type: 'oqubot_text',
        message0: '" %1 "',
        args0: [{ type: 'field_input', name: 'TEXT', text: 'Привет!' }],
        output: 'String',
        colour: '#FF8C1A',
        tooltip: 'Текстовое значение (строка)',
    },
    {
        type: 'oqubot_text_join',
        message0: '📝 соединить %1 и %2',
        args0: [
            { type: 'input_value', name: 'A', check: 'String' },
            { type: 'input_value', name: 'B', check: 'String' },
        ],
        output: 'String',
        colour: '#FF8C1A',
        tooltip: 'Соединяет два текста в один',
    },

    // ─── Variables ───
    {
        type: 'oqubot_var_set',
        message0: '📦 установить %1 = %2',
        args0: [
            { type: 'field_input', name: 'VAR', text: 'x' },
            { type: 'input_value', name: 'VALUE' },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: '#c792ea',
        tooltip: 'Создаёт переменную или присваивает ей значение',
    },
    {
        type: 'oqubot_var_get',
        message0: '📦 %1',
        args0: [{ type: 'field_input', name: 'VAR', text: 'x' }],
        output: null,
        colour: '#c792ea',
        tooltip: 'Получить значение переменной',
    },

    // ─── Print / Debug ───
    {
        type: 'oqubot_print',
        message0: '🖨 вывести %1',
        args0: [{ type: 'input_value', name: 'TEXT' }],
        previousStatement: null,
        nextStatement: null,
        colour: '#FF8C1A',
        tooltip: 'Выводит значение в консоль (для отладки)',
    },
];


// ──────────────────────────────────────────────────────────────
// 2. TOOLBOX DEFINITION
// ──────────────────────────────────────────────────────────────

function blockRef(type) {
    return { kind: 'block', type: type };
}

const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: '🤖 Робот',
            colour: '#4C97AF',
            contents: [
                blockRef('oqubot_open_mouth'),
                blockRef('oqubot_close_mouth'),
                blockRef('oqubot_move_head'),
                blockRef('oqubot_blink'),
                blockRef('oqubot_move_eyes'),
                blockRef('oqubot_led'),
            ],
        },
        {
            kind: 'category',
            name: '🔊 Звук',
            colour: '#9966FF',
            contents: [
                blockRef('oqubot_play_sound'),
                blockRef('oqubot_set_volume'),
            ],
        },
        {
            kind: 'category',
            name: '💬 Речь',
            colour: '#FF6680',
            contents: [
                {
                    kind: 'block', type: 'oqubot_say',
                    inputs: {
                        TEXT: { shadow: { type: 'oqubot_text', fields: { TEXT: 'Привет, я OquBot!' } } }
                    }
                },
                {
                    kind: 'block', type: 'oqubot_ask',
                    inputs: {
                        TEXT: { shadow: { type: 'oqubot_text', fields: { TEXT: 'Как тебя зовут?' } } }
                    }
                },
                blockRef('oqubot_listen'),
            ],
        },
        { kind: 'sep' },
        {
            kind: 'category',
            name: '🔁 Управление',
            colour: '#FFAB19',
            contents: [
                {
                    kind: 'block', type: 'oqubot_wait',
                    inputs: {
                        SECONDS: { shadow: { type: 'oqubot_number', fields: { NUM: 1 } } }
                    }
                },
                {
                    kind: 'block', type: 'oqubot_repeat',
                    inputs: {
                        TIMES: { shadow: { type: 'oqubot_number', fields: { NUM: 3 } } }
                    }
                },
                blockRef('oqubot_forever'),
            ],
        },
        {
            kind: 'category',
            name: '⚡ Логика',
            colour: '#59C059',
            contents: [
                blockRef('oqubot_if'),
                blockRef('oqubot_if_else'),
                blockRef('oqubot_compare'),
                blockRef('oqubot_logic_op'),
                blockRef('oqubot_not'),
            ],
        },
        {
            kind: 'category',
            name: '🔢 Математика',
            colour: '#5CB1D6',
            contents: [
                blockRef('oqubot_number'),
                blockRef('oqubot_math'),
                blockRef('oqubot_random'),
            ],
        },
        {
            kind: 'category',
            name: '📝 Текст',
            colour: '#FF8C1A',
            contents: [
                blockRef('oqubot_text'),
                blockRef('oqubot_text_join'),
                blockRef('oqubot_print'),
            ],
        },
        {
            kind: 'category',
            name: '📦 Переменные',
            colour: '#c792ea',
            contents: [
                blockRef('oqubot_var_set'),
                blockRef('oqubot_var_get'),
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

    // Precedence constants
    oquPython.ORDER_ATOMIC = 0;
    oquPython.ORDER_NONE = 99;

    oquPython.INDENT = '    ';

    // ── Scrub: chain sequential statements ──
    oquPython.scrub_ = function (block, code, thisOnly) {
        const next = block.nextConnection && block.nextConnection.targetBlock();
        if (next && !thisOnly) {
            return code + oquPython.blockToCode(next);
        }
        return code;
    };

    // ── Robot ──
    oquPython.forBlock['oqubot_open_mouth'] = function (block) {
        const angle = block.getFieldValue('ANGLE');
        return `robot.open_mouth(${angle})\n`;
    };
    oquPython.forBlock['oqubot_close_mouth'] = function () {
        return 'robot.close_mouth()\n';
    };
    oquPython.forBlock['oqubot_move_head'] = function (block) {
        const angle = block.getFieldValue('ANGLE');
        return `robot.move_head(${angle})\n`;
    };
    oquPython.forBlock['oqubot_blink'] = function () {
        return 'robot.blink()\n';
    };
    oquPython.forBlock['oqubot_move_eyes'] = function (block) {
        const dir = block.getFieldValue('DIRECTION');
        const dirMap = { LEFT: '"left"', RIGHT: '"right"', CENTER: '"center"' };
        return `robot.move_eyes(${dirMap[dir]})\n`;
    };
    oquPython.forBlock['oqubot_led'] = function (block) {
        const state = block.getFieldValue('STATE');
        return `robot.led(${state === 'ON' ? 'True' : 'False'})\n`;
    };

    // ── Sound ──
    oquPython.forBlock['oqubot_play_sound'] = function (block) {
        const sound = block.getFieldValue('SOUND');
        return `robot.play_sound("${sound}")\n`;
    };
    oquPython.forBlock['oqubot_set_volume'] = function (block) {
        const vol = block.getFieldValue('VOLUME');
        return `robot.set_volume(${vol})\n`;
    };

    // ── Speech ──
    oquPython.forBlock['oqubot_say'] = function (block, gen) {
        const text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return `robot.say(${text})\n`;
    };
    oquPython.forBlock['oqubot_ask'] = function (block, gen) {
        const text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return [`robot.ask(${text})`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_listen'] = function (block, gen) {
        return ['robot.listen()', gen.ORDER_ATOMIC];
    };

    // ── Control ──
    oquPython.forBlock['oqubot_wait'] = function (block, gen) {
        const secs = gen.valueToCode(block, 'SECONDS', gen.ORDER_ATOMIC) || '1';
        return `robot.wait(${secs})\n`;
    };
    oquPython.forBlock['oqubot_repeat'] = function (block, gen) {
        const times = gen.valueToCode(block, 'TIMES', gen.ORDER_ATOMIC) || '3';
        const body = gen.statementToCode(block, 'DO') || `${gen.INDENT}pass\n`;
        return `for i in range(${times}):\n${body}`;
    };
    oquPython.forBlock['oqubot_forever'] = function (block, gen) {
        const body = gen.statementToCode(block, 'DO') || `${gen.INDENT}pass\n`;
        return `while True:\n${body}`;
    };

    // ── Logic ──
    oquPython.forBlock['oqubot_if'] = function (block, gen) {
        const cond = gen.valueToCode(block, 'CONDITION', gen.ORDER_ATOMIC) || 'True';
        const body = gen.statementToCode(block, 'DO') || `${gen.INDENT}pass\n`;
        return `if ${cond}:\n${body}`;
    };
    oquPython.forBlock['oqubot_if_else'] = function (block, gen) {
        const cond = gen.valueToCode(block, 'CONDITION', gen.ORDER_ATOMIC) || 'True';
        const doBody = gen.statementToCode(block, 'DO') || `${gen.INDENT}pass\n`;
        const elseBody = gen.statementToCode(block, 'ELSE') || `${gen.INDENT}pass\n`;
        return `if ${cond}:\n${doBody}else:\n${elseBody}`;
    };
    oquPython.forBlock['oqubot_compare'] = function (block, gen) {
        const a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '0';
        const b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '0';
        const opMap = { EQ: '==', NEQ: '!=', LT: '<', GT: '>', LTE: '<=', GTE: '>=' };
        const op = opMap[block.getFieldValue('OP')];
        return [`${a} ${op} ${b}`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_logic_op'] = function (block, gen) {
        const a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || 'True';
        const b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || 'True';
        const op = block.getFieldValue('OP') === 'AND' ? 'and' : 'or';
        return [`${a} ${op} ${b}`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_not'] = function (block, gen) {
        const val = gen.valueToCode(block, 'BOOL', gen.ORDER_ATOMIC) || 'True';
        return [`not ${val}`, gen.ORDER_ATOMIC];
    };

    // ── Math ──
    oquPython.forBlock['oqubot_number'] = function (block, gen) {
        return [String(block.getFieldValue('NUM')), gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_math'] = function (block, gen) {
        const a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '0';
        const b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '0';
        const opMap = { ADD: '+', SUB: '-', MUL: '*', DIV: '/' };
        const op = opMap[block.getFieldValue('OP')];
        return [`${a} ${op} ${b}`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_random'] = function (block, gen) {
        const from = block.getFieldValue('FROM');
        const to = block.getFieldValue('TO');
        return [`random.randint(${from}, ${to})`, gen.ORDER_ATOMIC];
    };

    // ── Text ──
    oquPython.forBlock['oqubot_text'] = function (block, gen) {
        const text = block.getFieldValue('TEXT').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return [`"${text}"`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_text_join'] = function (block, gen) {
        const a = gen.valueToCode(block, 'A', gen.ORDER_ATOMIC) || '""';
        const b = gen.valueToCode(block, 'B', gen.ORDER_ATOMIC) || '""';
        return [`${a} + ${b}`, gen.ORDER_ATOMIC];
    };
    oquPython.forBlock['oqubot_print'] = function (block, gen) {
        const text = gen.valueToCode(block, 'TEXT', gen.ORDER_ATOMIC) || '""';
        return `print(${text})\n`;
    };

    // ── Variables ──
    oquPython.forBlock['oqubot_var_set'] = function (block, gen) {
        const varName = block.getFieldValue('VAR');
        const val = gen.valueToCode(block, 'VALUE', gen.ORDER_ATOMIC) || '0';
        return `${varName} = ${val}\n`;
    };
    oquPython.forBlock['oqubot_var_get'] = function (block, gen) {
        return [block.getFieldValue('VAR'), gen.ORDER_ATOMIC];
    };
}


// ──────────────────────────────────────────────────────────────
// 4. BLOCKLY THEME
// ──────────────────────────────────────────────────────────────

function createTheme() {
    return Blockly.Theme.defineTheme('oqubot_dark', {
        base: Blockly.Themes.Classic,
        componentStyles: {
            workspaceBackgroundColour: '#0d0f1a',
            toolboxBackgroundColour: '#07080f',
            toolboxForegroundColour: '#e0e4ff',
            flyoutBackgroundColour: '#111428',
            flyoutForegroundColour: '#e0e4ff',
            flyoutOpacity: 0.92,
            scrollbarColour: '#4a5072',
            scrollbarOpacity: 0.5,
            insertionMarkerColour: '#00d4ff',
            insertionMarkerOpacity: 0.4,
            cursorColour: '#00d4ff',
        },
        fontStyle: {
            family: 'Inter, sans-serif',
            weight: '500',
            size: 12,
        },
    });
}


// ──────────────────────────────────────────────────────────────
// 5. MAIN IDE CONTROLLER
// ──────────────────────────────────────────────────────────────

const OquIDE = {
    workspace: null,
    isRunning: false,
    isConnected: false,
    currentFile: null,

    // ── Initialize ──
    init() {
        // Register custom blocks
        Blockly.defineBlocksWithJsonArray(OQUBOT_BLOCKS);

        // Initialize code generator
        initGenerator();

        // Create workspace
        const theme = createTheme();
        this.workspace = Blockly.inject('blockly-div', {
            toolbox: TOOLBOX,
            theme: theme,
            grid: {
                spacing: 24,
                length: 3,
                colour: 'rgba(255,255,255,0.04)',
                snap: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.9,
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
        this.workspace.addChangeListener((event) => {
            if (event.type === Blockly.Events.BLOCK_MOVE ||
                event.type === Blockly.Events.BLOCK_CHANGE ||
                event.type === Blockly.Events.BLOCK_CREATE ||
                event.type === Blockly.Events.BLOCK_DELETE) {
                this.updateCode();
                this.updateBlockCount();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.resizeBlockly());
        this.resizeBlockly();

        // Setup resize handle for code panel
        this.setupResizeHandle();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Hide loading, show app
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('app').style.opacity = '1';
            document.getElementById('app').style.transition = 'opacity 0.5s ease';
            // Re-render workspace after it becomes visible
            setTimeout(() => Blockly.svgResize(this.workspace), 100);
        }, 800);

        console.log('[OquBot IDE] Initialized successfully');
    },

    // ── Resize Blockly to fit container ──
    resizeBlockly() {
        if (!this.workspace) return;
        const area = document.getElementById('blockly-area');
        const div = document.getElementById('blockly-div');
        div.style.width = area.offsetWidth + 'px';
        div.style.height = area.offsetHeight + 'px';
        Blockly.svgResize(this.workspace);
    },

    // ── Code Panel Resize Handle ──
    setupResizeHandle() {
        const handle = document.getElementById('resize-handle');
        const codePanel = document.getElementById('code-panel');
        let isDragging = false;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            handle.classList.add('active');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth >= 220 && newWidth <= 600) {
                codePanel.style.width = newWidth + 'px';
                this.resizeBlockly();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.classList.remove('active');
                document.body.style.cursor = '';
                this.resizeBlockly();
            }
        });
    },

    // ── Update generated code ──
    updateCode() {
        if (!oquPython || !this.workspace) return;
        try {
            let code = oquPython.workspaceToCode(this.workspace);
            const codeOutput = document.getElementById('code-output');

            if (!code || code.trim() === '') {
                codeOutput.innerHTML =
                    '<span class="code-comment"># Перетащите блоки на рабочую область,\n# чтобы увидеть сгенерированный код</span>';
                return;
            }

            // Add imports header
            const imports = this.detectImports(code);
            let fullCode = '';
            if (imports.length > 0) {
                fullCode += imports.join('\n') + '\n\n';
            }
            fullCode += '# Подключение к роботу\nrobot = oqubot.connect()\n\n';
            fullCode += '# Программа\n';
            fullCode += code;

            codeOutput.innerHTML = this.highlightPython(fullCode);
        } catch (e) {
            console.error('[OquBot IDE] Code generation error:', e);
        }
    },

    // ── Detect needed imports ──
    detectImports(code) {
        const imports = ['import oqubot'];
        if (code.includes('random.')) imports.push('import random');
        if (code.includes('time.')) imports.push('import time');
        return imports;
    },

    // ── Simple Python syntax highlighting ──
    highlightPython(code) {
        // Escape HTML
        let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Comments
        html = html.replace(/(#.*)/g, '<span class="code-comment">$1</span>');

        // Strings (double and single quoted)
        html = html.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="code-string">"$1"</span>');
        html = html.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="code-string">\'$1\'</span>');

        // Keywords
        const keywords = ['import', 'from', 'def', 'class', 'if', 'else', 'elif',
            'for', 'while', 'in', 'range', 'True', 'False', 'None',
            'not', 'and', 'or', 'return', 'pass', 'break', 'continue'];
        keywords.forEach((kw) => {
            const re = new RegExp(`\\b(${kw})\\b`, 'g');
            html = html.replace(re, '<span class="code-keyword">$1</span>');
        });

        // Numbers (not inside tags)
        html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');

        // Function calls
        html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="code-function">$1</span>(');

        return html;
    },

    // ── Update block count in menu ──
    updateBlockCount() {
        const count = this.workspace.getAllBlocks(false).length;
        document.getElementById('block-count').textContent = `Блоков: ${count}`;
    },

    // ── File Operations ──
    newProject() {
        if (this.workspace.getAllBlocks(false).length > 0) {
            if (!confirm('Создать новый проект? Несохранённые изменения будут потеряны.')) return;
        }
        this.workspace.clear();
        this.currentFile = null;
        this.updateCode();
        this.updateBlockCount();
        this.toast('Новый проект создан', 'info');
    },

    saveProject() {
        const data = Blockly.serialization.workspaces.save(this.workspace);
        const json = JSON.stringify(data, null, 2);

        // Try to save via pywebview API
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.save_project(json).then((result) => {
                if (result) {
                    this.currentFile = result;
                    this.toast('Проект сохранён', 'success');
                }
            });
        } else {
            // Fallback: download as file
            const blob = new Blob([json], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'oqubot_project.json';
            a.click();
            URL.revokeObjectURL(a.href);
            this.toast('Проект скачан как файл', 'success');
        }
    },

    saveProjectAs() {
        this.currentFile = null;
        this.saveProject();
    },

    openProject() {
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.open_project().then((result) => {
                if (result) {
                    try {
                        const data = JSON.parse(result);
                        Blockly.serialization.workspaces.load(data, this.workspace);
                        this.updateCode();
                        this.updateBlockCount();
                        this.toast('Проект загружен', 'success');
                    } catch (e) {
                        this.toast('Ошибка при загрузке проекта', 'error');
                        console.error(e);
                    }
                }
            });
        } else {
            // Fallback: file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        Blockly.serialization.workspaces.load(data, this.workspace);
                        this.updateCode();
                        this.updateBlockCount();
                        this.toast('Проект загружен', 'success');
                    } catch (err) {
                        this.toast('Ошибка при загрузке проекта', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }
    },

    exportCode() {
        if (!oquPython) return;
        const code = oquPython.workspaceToCode(this.workspace);
        if (!code.trim()) {
            this.toast('Нет блоков для экспорта', 'error');
            return;
        }

        // Full code with header
        const imports = this.detectImports(code);
        let fullCode = imports.join('\n') + '\n\nrobot = oqubot.connect()\n\n' + code;

        navigator.clipboard.writeText(fullCode).then(() => {
            this.toast('Код скопирован в буфер обмена', 'success');
        }).catch(() => {
            this.toast('Не удалось скопировать код', 'error');
        });
    },

    // ── Edit Operations ──
    undo() {
        this.workspace.undo(false);
    },
    redo() {
        this.workspace.undo(true);
    },
    clearWorkspace() {
        if (this.workspace.getAllBlocks(false).length === 0) return;
        if (confirm('Удалить все блоки с рабочей области?')) {
            this.workspace.clear();
            this.updateCode();
            this.updateBlockCount();
            this.toast('Рабочая область очищена', 'info');
        }
    },

    // ── Run / Stop ──
    runProgram() {
        if (!oquPython) return;
        const code = oquPython.workspaceToCode(this.workspace);
        if (!code.trim()) {
            this.toast('Добавьте блоки перед запуском', 'error');
            return;
        }

        this.isRunning = true;
        document.getElementById('btn-run').classList.add('action-btn--disabled');
        document.getElementById('btn-stop').classList.remove('action-btn--disabled');

        if (window.pywebview && window.pywebview.api) {
            const imports = this.detectImports(code);
            const fullCode = imports.join('\n') + '\n\nrobot = oqubot.connect()\n\n' + code;
            window.pywebview.api.run_code(fullCode).then((result) => {
                this.toast(result || 'Программа выполнена', 'success');
                this.stopProgram();
            }).catch((err) => {
                this.toast('Ошибка выполнения: ' + err, 'error');
                this.stopProgram();
            });
        } else {
            this.toast('▶ Программа запущена (демо-режим)', 'info');
            setTimeout(() => this.stopProgram(), 2000);
        }
    },

    stopProgram() {
        this.isRunning = false;
        document.getElementById('btn-run').classList.remove('action-btn--disabled');
        document.getElementById('btn-stop').classList.add('action-btn--disabled');

        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.stop_code();
        }
    },

    // ── Connect Robot ──
    connectRobot() {
        if (window.pywebview && window.pywebview.api) {
            this.toast('Поиск робота...', 'info');
            window.pywebview.api.connect_robot().then((result) => {
                if (result && result.success) {
                    this.isConnected = true;
                    document.getElementById('status-dot').classList.add('status-dot--connected');
                    document.getElementById('status-text').textContent = result.port || 'Подключён';
                    this.toast('Робот подключён!', 'success');
                } else {
                    this.toast('Робот не найден', 'error');
                }
            });
        } else {
            // Demo toggle
            this.isConnected = !this.isConnected;
            const dot = document.getElementById('status-dot');
            const text = document.getElementById('status-text');
            if (this.isConnected) {
                dot.classList.add('status-dot--connected');
                text.textContent = 'COM3 (демо)';
                this.toast('Робот подключён (демо)', 'success');
            } else {
                dot.classList.remove('status-dot--connected');
                text.textContent = 'Не подключён';
                this.toast('Робот отключён', 'info');
            }
        }
    },

    // ── Code Panel ──
    toggleCodePanel() {
        const panel = document.getElementById('code-panel');
        panel.classList.toggle('collapsed');
        setTimeout(() => this.resizeBlockly(), 300);
    },

    copyCode() {
        const codeEl = document.getElementById('code-output');
        const text = codeEl.innerText || codeEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.toast('Код скопирован', 'success');
        });
    },

    // ── Settings ──
    showSettings() {
        document.getElementById('settings-modal').classList.add('active');
    },
    showAbout() {
        document.getElementById('about-modal').classList.add('active');
    },
    showKeyboardShortcuts() {
        document.getElementById('shortcuts-modal').classList.add('active');
    },
    closeModal(id) {
        document.getElementById(id).classList.remove('active');
    },

    setLanguage(lang) {
        // Store for future use (full i18n will be implemented later)
        localStorage.setItem('oqubot_language', lang);
        this.toast('Язык будет применён при следующем запуске', 'info');
    },

    setCodeFontSize(size) {
        document.getElementById('code-output').style.fontSize = size + 'px';
        localStorage.setItem('oqubot_code_font_size', size);
    },

    setSounds(value) {
        // Blockly sounds are disabled by default in our config
        localStorage.setItem('oqubot_sounds', value);
    },

    // ── Keyboard Shortcuts ──
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Close modals on Escape
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach((m) => m.classList.remove('active'));
                return;
            }

            // Ctrl shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'n':
                        e.preventDefault();
                        this.newProject();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.openProject();
                        break;
                    case 's':
                        e.preventDefault();
                        if (e.shiftKey) this.saveProjectAs();
                        else this.saveProject();
                        break;
                    case 'z':
                        if (!e.shiftKey) {
                            // Let Blockly handle Ctrl+Z natively
                        }
                        break;
                }
            }

            // F5 - Run
            if (e.key === 'F5') {
                e.preventDefault();
                if (e.shiftKey) this.stopProgram();
                else this.runProgram();
            }
        });
    },

    // ── Toast Notifications ──
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toast-out 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ── Load saved settings ──
    loadSettings() {
        const fontSize = localStorage.getItem('oqubot_code_font_size');
        if (fontSize) {
            document.getElementById('code-output').style.fontSize = fontSize + 'px';
            const select = document.getElementById('setting-font-size');
            if (select) select.value = fontSize;
        }
        const lang = localStorage.getItem('oqubot_language');
        if (lang) {
            const select = document.getElementById('setting-language');
            if (select) select.value = lang;
        }
    },
};


// ──────────────────────────────────────────────────────────────
// 6. BOOT
// ──────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
    try {
        OquIDE.init();
        OquIDE.loadSettings();
    } catch (e) {
        console.error('[OquBot IDE] Initialization failed:', e);
        document.getElementById('loading-screen').innerHTML =
            `<div class="loading-logo">OquBot IDE</div>
             <div style="color:#ff3366; margin-top:16px;">Ошибка загрузки: ${e.message}</div>
             <div style="color:#7b82a8; margin-top:8px; font-size:12px;">
                Проверьте подключение к интернету (нужен CDN Blockly)
             </div>`;
    }
});

// Close modals on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});
