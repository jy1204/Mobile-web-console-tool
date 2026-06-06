// ========== 第一步：立即创建调试窗口（不等待DOMContentLoaded） ==========
(function() {
    // 立即创建调试窗口容器
    var warning = document.createElement('div');
    warning.className = 'warning';
    warning.style.border = '1px solid #8f8f8f';
    warning.style.borderRadius = '20px';
    warning.style.height = '500px';
    warning.style.backgroundColor = 'white';
    warning.style.overflow = 'hidden';
    warning.style.position = 'fixed';
    warning.style.left = '0';
    warning.style.top = '0';
    warning.style.userSelect = 'none';
    warning.style.zIndex = '9999';
    warning.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    warning.style.display = 'none';  // 默认显示
    
    // 标题
    var warningH1 = document.createElement('h1');
    warningH1.style.color = 'red';
    warningH1.style.margin = '0';
    warningH1.style.padding = '10px';
    warningH1.style.fontSize = '30px';
    warningH1.innerHTML = '调试信息:';
    warning.appendChild(warningH1);
    
    // 分割线
    var warningHr = document.createElement('hr');
    warningHr.style.margin = '0';
    warning.appendChild(warningHr);
    
    // 内容区域
    var warningUl = document.createElement('ul');
    if (document.documentElement.clientWidth <= 150) {
            warningUl.style.height = 'calc(100% - 100px)';
        }
        else {
            warningUl.style.height = 'calc(100% - 60px)';
        }
    warningUl.style.margin = '0';
    warningUl.style.padding = '0';
    warningUl.style.overflowX = 'hidden';
    warningUl.style.overflowY = 'auto';
    warningUl.style.backgroundColor = '#f5f5f5';
    warning.appendChild(warningUl);
    window.addEventListener('resize',function(){
        if (document.documentElement.clientWidth <= 150) {
            warningUl.style.height = 'calc(100% - 100px)';
        }
        else {
            warningUl.style.height = 'calc(100% - 60px)';
        }
    })
    
    // 清空按钮
    var clearBtn = document.createElement('button');
    clearBtn.textContent = '清空';
    clearBtn.style.position = 'absolute';
    clearBtn.style.top = '10px';
    clearBtn.style.right = '10px';
    clearBtn.style.padding = '5px 10px';
    clearBtn.style.backgroundColor = '#8f8f8f';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '5px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.fontSize = '12px';
    clearBtn.onclick = function() {
        warningUl.innerHTML = '';
    };
    warning.appendChild(clearBtn);
    
    // 立即添加到 body（即使 body 还没加载完，也会在加载完成后自动添加）
    if (document.body) {
        document.body.appendChild(warning);
    } else {
        // 如果 body 还没加载，等待 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(warning);
        });
    }
    
    // 查看/隐藏按钮
    var toggleBtn = document.createElement('div');
    toggleBtn.innerHTML = '查看<br>调试';
    toggleBtn.className = 'toggleBtn';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.left = '0';
    toggleBtn.style.bottom = '0';
    toggleBtn.style.width = '50px';
    toggleBtn.style.height = '50px';
    toggleBtn.style.lineHeight = '25px';
    toggleBtn.style.textAlign = 'center';
    toggleBtn.style.backgroundColor = '#02d9ff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.userSelect = 'none';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.borderRadius = '0 10px 0 0';
    toggleBtn.onclick = function() {
        warning.style.display = warning.style.display === 'none' ? 'block' : 'none';
    };
    
    if (document.body) {
        document.body.appendChild(toggleBtn);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(toggleBtn);
        });
    }
    
    // 保存引用供其他地方使用
    window._debugWindow = warning;
    window._debugList = warningUl;
})();

// ========== 第二步：立即拦截所有控制台输出 ==========
(function() {
    // 保存原始方法
    var original = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
        table: console.table,
        dir: console.dir,
        assert: console.assert
    };
    
    // 添加消息到调试窗口
    function addToDebug(text, type) {
        var colors = {
            log: '#2d5a2c',
            warn: '#e6a017', 
            error: '#c23b22',
            info: '#2737c5d2',
            debug: '#6c3483',
            trace: '#8e44ad',
            table: '#2980b9',
            dir: '#16a085',
            assert: '#c23b22'
        };
        
        var bgColor = colors[type] || '#2737c5d2';
        var prefix = type.toUpperCase();
        
        // 查找调试列表
        var warningUl = window._debugList || document.querySelector('.warning ul');
        
        if (!warningUl) {
            // 如果还没创建，等待一下
            setTimeout(function() {
                addToDebug(text, type);
            }, 10);
            return;
        }
        
        // 创建li元素
        var li = document.createElement('li');
        li.textContent = '[' + prefix + '] ' + text;
        li.style.listStyle = 'none';
        li.style.padding = '5px 20px';
        li.style.color = 'white';
        li.style.backgroundColor = bgColor;
        li.style.wordBreak = 'break-all';
        li.style.marginBottom = '1px';
        li.style.fontSize = '12px';
        li.style.fontFamily = 'monospace';
        
        warningUl.appendChild(li);
        warningUl.scrollTop = warningUl.scrollHeight;
    }
    
    // 格式化参数
    function formatArg(arg) {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (arg instanceof Error) return arg.stack || arg.message;
        if (typeof arg === 'object') {
            try {
                return JSON.stringify(arg, null, 2);
            } catch(e) {
                return String(arg);
            }
        }
        return String(arg);
    }
    
    // 拦截所有 console 方法
    console.log = function() {
        original.log.apply(console, arguments);
        var msg = Array.from(arguments).map(formatArg).join(' ');
        addToDebug(msg, 'log');
    };
    
    console.warn = function() {
        original.warn.apply(console, arguments);
        var msg = Array.from(arguments).map(formatArg).join(' ');
        addToDebug(msg, 'warn');
    };
    
    console.error = function() {
        original.error.apply(console, arguments);
        var msg = Array.from(arguments).map(formatArg).join(' ');
        addToDebug(msg, 'error');
    };
    
    console.info = function() {
        original.info.apply(console, arguments);
        var msg = Array.from(arguments).map(formatArg).join(' ');
        addToDebug(msg, 'info');
    };
    
    console.debug = function() {
        original.debug.apply(console, arguments);
        var msg = Array.from(arguments).map(formatArg).join(' ');
        addToDebug(msg, 'debug');
    };
    
    console.trace = function() {
        original.trace.apply(console, arguments);
        addToDebug('Trace called', 'trace');
    };
    
    console.table = function(data) {
        original.table.apply(console, arguments);
        try {
            var str = JSON.stringify(data, null, 2);
            addToDebug('\n' + str, 'table');
        } catch(e) {
            addToDebug(String(data), 'table');
        }
    };
    
    console.dir = function(obj) {
        original.dir.apply(console, arguments);
        try {
            var str = JSON.stringify(obj, null, 2);
            addToDebug('\n' + str, 'dir');
        } catch(e) {
            addToDebug(String(obj), 'dir');
        }
    };
    
    console.assert = function(condition, ...args) {
        original.assert.apply(console, arguments);
        if (!condition) {
            var msg = args.map(formatArg).join(' ');
            addToDebug('Assertion failed: ' + msg, 'assert');
        }
    };
})();

// ========== 第三步：捕获所有错误 ==========
(function() {
    // 全局错误
    window.addEventListener('error', function(event) {
        var msg = event.message + ' at ' + event.filename + ':' + event.lineno;
        if (event.error && event.error.stack) {
            msg += '\n' + event.error.stack;
        }
        
        var warningUl = window._debugList || document.querySelector('.warning ul');
        if (warningUl) {
            var li = document.createElement('li');
            li.textContent = '[ERROR] ' + msg;
            li.style.listStyle = 'none';
            li.style.padding = '5px 20px';
            li.style.color = 'white';
            li.style.backgroundColor = '#c23b22';
            li.style.wordBreak = 'break-all';
            li.style.whiteSpace = 'pre-wrap';
            warningUl.appendChild(li);
            warningUl.scrollTop = warningUl.scrollHeight;
        }
        return false;
    });
    
    // Promise 错误
    window.addEventListener('unhandledrejection', function(event) {
        var reason = event.reason;
        var msg = reason ? (reason.stack || reason.message || String(reason)) : '未知 Promise 错误';
        
        var warningUl = window._debugList || document.querySelector('.warning ul');
        if (warningUl) {
            var li = document.createElement('li');
            li.textContent = '[PROMISE] ' + msg;
            li.style.listStyle = 'none';
            li.style.padding = '5px 20px';
            li.style.color = 'white';
            li.style.backgroundColor = '#c23b22';
            li.style.wordBreak = 'break-all';
            warningUl.appendChild(li);
            warningUl.scrollTop = warningUl.scrollHeight;
        }
    });
})();

// ========== 第四步：提供手动添加方法 ==========
window.add_warning = function(text) {
    var warningUl = window._debugList || document.querySelector('.warning ul');
    if (!warningUl) return;
    
    var li = document.createElement('li');
    li.textContent = text;
    li.style.listStyle = 'none';
    li.style.padding = '5px 20px';
    li.style.color = 'white';
    li.style.backgroundColor = '#2737c5d2';
    li.style.wordBreak = 'break-all';
    warningUl.appendChild(li);
    warningUl.scrollTop = warningUl.scrollHeight;
};

// 输出启动完成信息
console.log('调试系统已启动');