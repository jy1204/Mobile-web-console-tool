// ========== 第一步：立即创建调试窗口（不等待DOMContentLoaded） ==========
(function() {
    const warningBoxIsExpand = false;//启动时盒子是否展开
	const warningBoxMessageExpand = false;//有消息时盒子是否自动展开
    const warningUlAutoScroll = true;//是否自动滚动到底部
    /* 以上const修饰的变量值可更改 */

	let offsetX, offsetY;
	let isDragging = false;
	
	// 获取坐标（兼容 PC 和移动端）
	function getPagePos(e) {
		if (e.touches) {
			// 移动端
			return { x: e.touches[0].pageX, y: e.touches[0].pageY };
		}
		// PC 端
		return { x: e.pageX, y: e.pageY };
	}
	
	function WarningMove(e) {
		e.preventDefault();
		isDragging = true;
		const pos = getPagePos(e);
		let x = pos.x - offsetX;
		let y = pos.y - offsetY;
		let maxX = window.innerWidth - 40;
		let maxY = window.innerHeight - 40;
		x = Math.min(Math.max(0, x), maxX);
		y = Math.min(Math.max(0, y), maxY);
		/* x = Math.max(0, x);
		y = Math.max(0, y); */
		warningBox.style.left = x + 'px';
		warningBox.style.top = y + 'px';
		if (x > window.innerWidth/2) {
			warningCount.style.left = "auto";
			warningCount.style.right = "35px";
			warningCount.style.borderRadius = "20px 20px 0 20px";
		}
		else {
			warningCount.style.left = "35px";
			warningCount.style.right = "auto";
			warningCount.style.borderRadius = "20px 20px 20px 0";
		}
	}
	
	function stopDrag() {
		window.removeEventListener('mousemove', WarningMove);
		window.removeEventListener('mouseup', stopDrag);
		window.removeEventListener('touchmove', WarningMove);
		window.removeEventListener('touchend', stopDrag);
	}
	
	function startDrag(e) {
		e.preventDefault();
		isDragging = false;
		let pos = getPagePos(e);
		offsetX = pos.x - warningBox.offsetLeft;
		offsetY = pos.y - warningBox.offsetTop;
		
		// 同时监听鼠标和触摸事件
		window.addEventListener('mousemove', WarningMove);
		window.addEventListener('mouseup', stopDrag);
		window.addEventListener('touchmove', WarningMove, { passive: false });
		window.addEventListener('touchend', stopDrag);
	}
    // 立即创建调试窗口容器
    let warningBox = document.createElement('div');
    warningBox.className = 'warning-box';
	warningBox.id = 'warning-box';
	warningBox.style.cssText = `
	    position: fixed;
	    top: 0;
	    left: 0;
		width: 40px;
		height: 40px;
	    border-radius: 20px;
	    z-index: 9999;
		overflow: hidden;
	`;

	let warningToggleBtn = document.createElement('div');
	warningToggleBtn.className = 'warningToggleBtn';
	warningToggleBtn.id = 'warningToggleBtn';
	warningToggleBtn.style.cssText = `
		position: fixed;
		width: 40px;
		height: 40px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		top: auto;
		left: auto;
		font-size: 14px;
		text-align: center;
		line-height: 20px;
		cursor: default;
		user-Select: none;
		z-index: 9999;
	`;
	warningToggleBtn.innerHTML = '查看调试';
	warningBox.appendChild(warningToggleBtn);
	// 按钮拖拽（同时支持鼠标和触摸）
	warningToggleBtn.addEventListener('mousedown', startDrag);
	warningToggleBtn.addEventListener('touchstart', startDrag, { passive: false});
	
	// 按钮点击（区分拖拽和点击）
	warningToggleBtn.addEventListener('click', function(e) {
		if (!isDragging) {
			// 如果没有拖动，触发点击逻辑
			warningBox.style.overflow = warningBox.style.width = warningBox.style.height = '';
			warning.style.opacity = '1';
			this.style.display = 'none';
		}
		isDragging = false;
	});
	
	// 移动端也需要处理 touchend 防止误判
	warningToggleBtn.addEventListener('touchend', function(e) {
		if (!isDragging) {
			// 如果没有拖动，触发点击逻辑
			warningBox.style.overflow = warningBox.style.width = warningBox.style.height = '';
			warning.style.opacity = '1';
			this.style.display = 'none';
		}
		isDragging = false;
	});
	
	let warningCount = document.createElement('div');
	warningCount.style.cssText = `
		position: absolute;
		top: -5px;
		left: 35px;
		background: rgb(255, 0, 0);
		border-radius: 20px 20px 20px 0;
		font-size: 16px;
		color: white;
		font-weight: bold;
	`;
	warningToggleBtn.appendChild(warningCount);
	
    let warning = document.createElement('div');
    warning.className = 'warning';
	warning.id = 'warning';
	warning.style.cssText = `
		min-width: 176px;
		border: 1px solid #8f8f8f;
		border-radius: 20px;
		background-color: white;
		box-sizing: border-box;
		overflow: auto;
		user-select: none;
		opacity: 0;
	`;
    
    // 标题
    let warningTitle = document.createElement('div');
    warningTitle.style.height = '50px';
    warningTitle.style.display = 'flex'; 
    let warningH1 = document.createElement('h1');
	warningH1.style.cssText = `
		display: flex;
		color: red;
		margin: 0;
		padding-left: 10px;
		font-size: 25px;
		width: 80%;
		height: 100%;
		align-items: center;
		user-select: none;
		cursor: default;
		-webkit-user-select: none;
		draggable: false;
	`;
    warningH1.innerHTML = '调试信息:';
    warningTitle.appendChild(warningH1);
    
    // 阻止默认事件
	warningH1.addEventListener('dragstart', function(e) {
		e.preventDefault();
		return false;
	});
	
	warningH1.addEventListener('selectstart', function(e) {
		e.preventDefault();
		return false;
	});
	
	// 标题栏拖拽（同时支持鼠标和触摸）
	warningH1.addEventListener('mousedown', function(e) {
		e.preventDefault();
		if (e.button !== 0) return;
		startDrag(e);
	});
	
	warningH1.addEventListener('touchstart', function(e) {
		e.preventDefault();
		startDrag(e);
	}, { passive: false });
	
	// 标题栏点击（收起）
	warningH1.addEventListener('click', function() {
		if (isDragging) {
			isDragging = false;
			return;
		}
		window._debugCounter = null;
		window._debugCountBox.style.padding = '0';
		window._debugCountBox.innerHTML = '';
		warningBox.style.overflow = 'hidden';
		warningBox.style.width = warningBox.style.height = '40px';
		warning.style.opacity = '0';
		warningToggleBtn.style.display = 'block';
	});
	
	// 移动端 touchend 处理
	warningH1.addEventListener('touchend', function() {
		if (!isDragging) {
			window._debugCounter = null;
			window._debugCountBox.style.padding = '0';
			window._debugCountBox.innerHTML = '';
			warningBox.style.overflow = 'hidden';
			warningBox.style.width = warningBox.style.height = '40px';
			warning.style.opacity = '0';
			warningToggleBtn.style.display = 'block';
		}
		isDragging = false;
	});
	
	// 全局停止拖拽
	window.addEventListener('mouseup', stopDrag);
	window.addEventListener('touchend', stopDrag);
    
    // 清空按钮
    let clearBtn = document.createElement('button');
	clearBtn.style.cssText = `
		width: 20%;
		height: 100%;
		margin: 0;
		padding: 5px 10px;
		background-color: #8f8f8f;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 12px;
		outline: none;
	`;
    clearBtn.textContent = '清空';
	clearBtn.addEventListener('click',function() {
		warningUl.innerHTML = '';
	})
    warningTitle.appendChild(clearBtn);
    
    warning.appendChild(warningTitle);
    
    // 分割线
    let warningHr = document.createElement('hr');
    warningHr.style.margin = '0';
    warning.appendChild(warningHr);
    
    // 内容区域
    let warningUl = document.createElement('ul');
	warningUl.style.cssText = `
		margin: 0;
		padding: 0;
		max-height: 500px;
		overflow-x: hidden;
		overflow-y: auto;
		background-color: '#f5f5f5';
		font-family: 'Consolas, Monaco, "Courier New", monospace';
		font-size = '12px';
	`;
    warning.appendChild(warningUl);
    warningBox.appendChild(warning);
    
    // 立即添加到 body
    if (document.body) {
        document.body.appendChild(warningBox);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(warningBox);
        });
    }
    window.addEventListener('resize',function(){
		warningBox.style.top = '0';
		warningBox.style.left = '0';
        warningCount.style.left = '35px';
        warningCount.style.right = 'auto';
        warningCount.style.borderRadius = '20px 20px 20px 0';
	})
    if (warningBoxIsExpand) {
        warningBox.style.overflow = warningBox.style.width = warningBox.style.height = '';
        warning.style.opacity = '1';
        warningToggleBtn.style.display = 'none';
    }
    // 保存引用供其他地方使用
	window._debugWarningBox = warningBox;
    window._debugList = warningUl;
	window._debugCountBox = warningCount;
	window._debugCounter = -1;
    window._debugMessageExpand = warningBoxMessageExpand;
    window._debugAutoScroll = warningUlAutoScroll;
})();

// ========== 第二步：封装创建 li 元素的全局函数 ==========
(function() {
    // 统一的颜色配置
    window._debugColors = {
        log: '#2d5a2c',
        warn: '#e6a017', 
        error: '#c23b22',
        info: '#2737c5d2',
        debug: '#6c3483',
        trace: '#8e44ad',
        table: '#2980b9',
        dir: '#16a085',
        dirxml: '#e67e22',
        assert: '#c23b22',
        group: '#555555',
        count: '#2980b9',
        time: '#16a085',
        clear: '#8e44ad',
        profile: '#9b59b6',
        timestamp: '#1abc9c',
        network: '#e74c3c',
        resource: '#e67e22',
        worker: '#9b59b6',
        websocket: '#e74c3c',
        iframe: '#16a085',
        vue: '#42b883',
        react: '#61dafb',
        add_warning: '#9b59b6'
    };
    
    // 统一的转义函数
    window._escapeHtml = function(text) {
        if (!text) return '';
        return String(text).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/\n/g, '<br>');
    };
    
    // 增强的格式化函数（修复版 - 大数组使用可交互对象）
    window._formatValue = function(value, depth = 0) {
        if (depth > 4) return '[循环引用/太深]';
        
        if (value === undefined) return 'undefined';
        if (value === null) return 'null';
        
        // 错误对象
        if (value instanceof Error) {
            return value.stack || value.toString();
        }
        
        // DOM 元素
        if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) {
            let str = `<${value.tagName.toLowerCase()}`;
            if (value.id) str += `#${value.id}`;
            if (value.className && typeof value.className === 'string') {
                let classes = value.className.split(' ').filter(c => c && c !== '');
                if (classes.length) str += `.${classes.join('.')}`;
            }
            str += '>';
            let text = value.textContent || value.innerText;
            if (text && text.length < 100) str += text.substring(0, 50);
            else if (text) str += '...';
            str += `</${value.tagName.toLowerCase()}>`;
            return str;
        }
        
        // 正则
        if (value instanceof RegExp) return value.toString();
        
        // 日期
        if (value instanceof Date) return value.toISOString();
        
        // Map
        if (value instanceof Map) {
            let entries = [];
            for (let [k, v] of value) {
                entries.push(`${window._formatValue(k, depth + 1)} => ${window._formatValue(v, depth + 1)}`);
                if (entries.length > 10) break;
            }
            return `Map(${value.size}) { ${entries.join(', ')}${entries.length < value.size ? ', ...' : ''} }`;
        }
        
        // Set
        if (value instanceof Set) {
            let values = [];
            for (let v of value) {
                values.push(window._formatValue(v, depth + 1));
                if (values.length > 10) break;
            }
            return `Set(${value.size}) { ${values.join(', ')}${values.length < value.size ? ', ...' : ''} }`;
        }
        
        // 数组 - 大数组返回可交互对象标记
        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            if (value.length > 20 || depth === 0) {
                // 大数组或顶层数组，返回可交互对象
                return { _isObject: true, _value: value };
            }
            let items = value.slice(0, 10).map(v => window._formatValue(v, depth + 1));
            if (value.length > 10) items.push(`... ${value.length - 10} more items`);
            return `[${items.join(', ')}]`;
        }
        
        // 函数
        if (typeof value === 'function') {
            return `ƒ ${value.name || 'anonymous'}()`;
        }
        
        // Symbol
        if (typeof value === 'symbol') return value.toString();
        
        // 数字特殊值
        if (typeof value === 'number') {
            if (isNaN(value)) return 'NaN';
            if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
            return String(value);
        }
        
        // 大整数
        if (typeof value === 'bigint') return `${value}n`;
        
        // 字符串
        if (typeof value === 'string') {
            return value;
        }
        
        // 布尔值
        if (typeof value === 'boolean') return String(value);
        
        // 普通对象
        if (typeof value === 'object') {
            return { _isObject: true, _value: value };
        }
        
        return String(value);
    };
    
    // 创建可交互对象展开元素（修复版 - 支持大数组完整显示）
    window._createInteractiveObject = function(obj, depth = 0) {
        if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) {
            let container = document.createElement('span');
            
            // 全量输出 outerHTML，无截断
            let fullHTML = obj.outerHTML;
            
            // 使用可滚动区域避免界面卡死
            container.style.display = 'inline-block';
            container.style.maxWidth = '100%';
            container.style.overflowX = 'auto';
            container.style.whiteSpace = 'pre-wrap';
            container.style.wordBreak = 'break-all';
            container.innerHTML = `<span>${window._escapeHtml(fullHTML)}</span>`;
            
            return container;
        }
        if (depth > 3) {
            let text = String(obj);
            return document.createTextNode(text);
        }
        
        let container = document.createElement('span');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'flex-start';
        container.style.flexWrap = 'wrap';
        container.style.maxWidth = '100%';
        
        if (obj === null) {
            container.innerHTML = '<span style="color:#888">null</span>';
            return container;
        }
        
        if (obj === undefined) {
            container.innerHTML = '<span style="color:#888">undefined</span>';
            return container;
        }
        
        if (typeof obj !== 'object') {
            let text = String(obj);
            container.innerHTML = window._escapeHtml(text);
            return container;
        }
        
        let isArray = Array.isArray(obj);
        let keys = Object.keys(obj);
        let isEmpty = keys.length === 0;
        
        if (isEmpty) {
            container.innerHTML = isArray ? '[]' : '{}';
            return container;
        }
        
        // 创建可折叠的包装器
        let wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.maxWidth = '100%';
        wrapper.style.verticalAlign = 'top';
        
        let toggle = document.createElement('span');
        toggle.textContent = '▶ ';
        toggle.style.cursor = 'pointer';
        toggle.style.display = 'inline-block';
        toggle.style.fontSize = '12px';
        toggle.style.color = '#ffd700';
        toggle.style.userSelect = 'none';
        
        let preview = document.createElement('span');
        let previewText = '';
        if (isArray) {
            previewText = `Array(${obj.length})`;
            if (obj.length > 0 && obj.length <= 10) {
                let previewItems = obj.slice(0, 5).map(v => {
                    if (typeof v === 'object') return '{...}';
                    let str = String(v);
                    return str.length > 20 ? str.substring(0, 17) + '...' : str;
                }).join(', ');
                previewText += ` [${previewItems}${obj.length > 5 ? ', ...' : ''}]`;
            } else if (obj.length > 0) {
                let firstItem = obj[0];
                let firstStr = typeof firstItem === 'object' ? '{...}' : String(firstItem);
                if (firstStr.length > 20) firstStr = firstStr.substring(0, 17) + '...';
                previewText += ` [${firstStr}, ...] (${obj.length} 项)`;
            }
        } else {
            let keysPreview = keys.slice(0, 5).map(k => {
                let v = obj[k];
                let valStr = typeof v === 'object' ? '{...}' : String(v);
                if (valStr.length > 15) valStr = valStr.substring(0, 12) + '...';
                return `${k}: ${valStr}`;
            }).join(', ');
            previewText = `{${keysPreview}${keys.length > 5 ? ', ...' : ''}} (${keys.length} 属性)`;
        }
        preview.textContent = previewText;
        preview.style.color = '#aaa';
        preview.style.fontSize = '12px';
        
        let content = document.createElement('div');
        content.style.display = 'none';
        content.style.marginLeft = '20px';
        content.style.marginTop = '8px';
        content.style.marginBottom = '4px';
        content.style.borderLeft = '2px solid rgba(255,255,255,0.2)';
        content.style.paddingLeft = '8px';
        content.style.maxHeight = '300px';
        content.style.overflowY = 'auto';
        
        // 构建内容 - 显示所有项（支持滚动）
        let maxItemsToShow = isArray ? Math.min(obj.length, 500) : Math.min(keys.length, 200);
        let itemsToShow = isArray ? obj.slice(0, maxItemsToShow) : keys.slice(0, maxItemsToShow);
        
        for (let i = 0; i < itemsToShow.length; i++) {
            let item = document.createElement('div');
            item.style.marginBottom = '6px';
            item.style.wordBreak = 'break-word';
            item.style.fontSize = '11px';
            
            let keySpan = document.createElement('span');
            if (isArray) {
                keySpan.textContent = `${i}: `;
            } else {
                keySpan.textContent = `${itemsToShow[i]}: `;
            }
            keySpan.style.color = '#4a90d9';
            keySpan.style.fontWeight = 'bold';
            keySpan.style.fontSize = '11px';
            item.appendChild(keySpan);
            
            let valueSpan = document.createElement('span');
            let val = isArray ? obj[i] : obj[itemsToShow[i]];
            let formattedValue = window._createInteractiveObject(val, depth + 1);
            valueSpan.appendChild(formattedValue);
            item.appendChild(valueSpan);
            
            content.appendChild(item);
        }
        
        let totalCount = isArray ? obj.length : keys.length;
        if (totalCount > maxItemsToShow) {
            let more = document.createElement('div');
            more.textContent = `... 还有 ${totalCount - maxItemsToShow} ${isArray ? '项' : '个属性'}`;
            more.style.color = '#888';
            more.style.fontStyle = 'italic';
            more.style.fontSize = '11px';
            more.style.marginTop = '6px';
            content.appendChild(more);
        }
        
        let isOpen = false;
        toggle.onclick = (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            toggle.textContent = isOpen ? '▼ ' : '▶ ';
            content.style.display = isOpen ? 'block' : 'none';
        };
        
        wrapper.appendChild(toggle);
        wrapper.appendChild(preview);
        wrapper.appendChild(content);
        
        return wrapper;
    };
    
    // 创建 li 元素的函数（修复版 - 确保颜色正确）
    window._createDebugLi = function(text, type, options = {}) {
        let bgColor = window._debugColors[type] || window._debugColors.log || '#2737c5d2';
        let prefix = type.toUpperCase();
        
        // 处理缩进
        let indent = options.indent || '';
        
        let li = document.createElement('li');
        li.style.cssText = `
            list-style: none;
            padding: 8px 16px;
            color: white;
            word-break: break-word;
            white-space: pre-wrap;
            margin-bottom: 2px;
            font-size: 12px;
            font-family: 'Consolas, Monaco, "Courier New", monospace';
            user-select: text;
            line-height: 1.5;
            border-radius: 4px;
        `;
        li.style.backgroundColor = bgColor;
        li.pressTimer = null;
        
        // ========== 移动端：长按复制 ==========
        li.addEventListener('touchstart', function(event) {
            if (event.touches.length === 1) {
                li.pressTimer = setTimeout(() => {
                    handleCopy(event, li);
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                }, 500);
            }
        });
        
        li.addEventListener('touchmove', function() {
            if (li.pressTimer) {
                clearTimeout(li.pressTimer);
                li.pressTimer = null;
            }
        });
        
        li.addEventListener('touchend', function() {
            if (li.pressTimer) {
                clearTimeout(li.pressTimer);
                li.pressTimer = null;
            }
        });
        
        li.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            handleCopy(event, li);
        });
        
        function handleCopy(event, element) {
            const textToCopy = element.textContent || element.innerText;
            
            if (!textToCopy || textToCopy.trim() === '') {
                showFeedback('⚠️ 没有可复制的内容', 'warning');
                return;
            }
            
            navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                showFeedback('✅ 复制成功！', 'success', element);
            }).catch(() => {
                fallbackCopyText(textToCopy, element);
            });
        }
        
        function showFeedback(message, type, element = null) {
            if (element && type === 'success') {
                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = '#4caf50';
                element.style.transition = 'background-color 0.2s';
                setTimeout(() => {
                    element.style.backgroundColor = originalBg;
                }, 200);
            }
            
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background-color: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(0, 0, 0, 0.8)'};
                color: white;
                padding: 10px 20px;
                border-radius: 24px;
                font-size: 14px;
                font-family: system-ui, -apple-system, sans-serif;
                z-index: 9999;
                white-space: nowrap;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                pointer-events: none;
                animation: fadeInOut 1.5s ease-in-out;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                }
            `;
            if (!document.querySelector('#copy-toast-style')) {
                style.id = 'copy-toast-style';
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 1500);
        }
        
        function fallbackCopyText(text, element) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            textarea.style.left = '-9999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const success = document.execCommand('copy');
                if (success) {
                    showFeedback('✅ 复制成功！', 'success', element);
                } else {
                    showFeedback('❌ 复制失败，请手动复制', 'error');
                }
            } catch (err) {
                showFeedback('❌ 复制失败', 'error');
            }
            
            document.body.removeChild(textarea);
        }
        
        // 添加前缀
        let prefixSpan = document.createElement('span');
        prefixSpan.style.fontWeight = 'bold';
        prefixSpan.style.marginRight = '8px';
        prefixSpan.style.opacity = '0.9';
        prefixSpan.innerHTML = `[${prefix}] ${indent}`;
        li.appendChild(prefixSpan);
        
        // 支持可交互对象
        if (options.interactiveObject) {
            li.appendChild(window._createInteractiveObject(options.interactiveObject));
        }
        // 支持HTML内容
        else if (options.htmlContent) {
            let contentSpan = document.createElement('span');
            contentSpan.innerHTML = options.htmlContent;
            li.appendChild(contentSpan);
        }
        // 支持CSS样式
        else if (options.cssStyles && options.styledParts) {
            let contentSpan = document.createElement('span');
            for (let part of options.styledParts) {
                let span = document.createElement('span');
                span.innerHTML = part.text;
                if (part.style) {
                    Object.assign(span.style, part.style);
                }
                contentSpan.appendChild(span);
            }
            li.appendChild(contentSpan);
        }
        // 普通文本
        else if (text && text.trim()) {
            let textSpan = document.createElement('span');
            textSpan.innerHTML = window._escapeHtml(text);
            li.appendChild(textSpan);
        }
        
        // 添加自定义属性
        if (options.attributes) {
            for (let key in options.attributes) {
                li.setAttribute(key, options.attributes[key]);
            }
        }
        
        return li;
    };
    
    // 添加 li 到调试窗口的函数
    window._appendToDebug = function(li) {
        let warningUl = window._debugList || document.querySelector('#warning ul');
        if (!warningUl) {
            setTimeout(() => window._appendToDebug(li), 10);
            return false;
        }
        window._debugCounter++;
        if (window._debugCounter > 0) {
            if (window._debugMessageExpand) {
                if (window._debugWarningBox) {
                    window._debugWarningBox.style.overflow = window._debugWarningBox.style.width = window._debugWarningBox.style.height = '';
                    if (window._debugWarningBox.lastElementChild) {
                        window._debugWarningBox.lastElementChild.style.opacity = '1';
                    }
                    if (window._debugWarningBox.firstElementChild) {
                        window._debugWarningBox.firstElementChild.style.display = 'none';
                    }
                }
            }
            else if (window._debugCountBox) {
                window._debugCountBox.innerHTML = window._debugCounter;
                window._debugCountBox.style.padding = '2px 8px';
            }
        }
        warningUl.appendChild(li);
        let lastLi = warningUl.lastElementChild;
        if (lastLi && window._debugAutoScroll) {
            lastLi.scrollIntoView(false);
        }
        return true;
    };
    
    // 一键添加调试信息
    window._addDebugMessage = function(text, type, options = {}) {
        let li = window._createDebugLi(text, type, options);
        return window._appendToDebug(li);
    };
})();

// ========== 第三步：立即拦截所有控制台输出（完整版 - 修复版） ==========
(function() {
    // 保存原始方法
    let original = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
        table: console.table,
        dir: console.dir,
        dirxml: console.dirxml,
        group: console.group,
        groupCollapsed: console.groupCollapsed,
        groupEnd: console.groupEnd,
        count: console.count,
        countReset: console.countReset,
        time: console.time,
        timeLog: console.timeLog,
        timeEnd: console.timeEnd,
        assert: console.assert,
        clear: console.clear,
        profile: console.profile,
        profileEnd: console.profileEnd,
        timeStamp: console.timeStamp
    };
    
    // 分组缩进
    let groupLevel = 0;
    
    // 存储
    let timers = new Map();
    let counters = new Map();
    let profiles = new Map();
    
    // CSS样式解析器
    function parseCSSStyles(args) {
        let argsArray = Array.from(args);
        
        if (argsArray.length === 0) return null;
        
        let firstArg = argsArray[0];
        if (typeof firstArg !== 'string') return null;
        
        if (!firstArg.includes('%c')) return null;
        
        let parts = [];
        let styles = [];
        let lastIndex = 0;
        let styleIndex = 1;
        
        let regex = /%c/g;
        let match;
        let text = firstArg;
        
        while ((match = regex.exec(text)) !== null) {
            parts.push(text.substring(lastIndex, match.index));
            lastIndex = match.index + 2;
            if (styleIndex < argsArray.length) {
                let style = argsArray[styleIndex++];
                styles.push(typeof style === 'string' ? style : '');
            } else {
                styles.push('');
            }
        }
        parts.push(text.substring(lastIndex));
        
        let remainingArgs = argsArray.slice(styleIndex);
        
        return {
            parts: parts,
            styles: styles,
            remainingArgs: remainingArgs
        };
    }
    
    // 应用CSS样式
    function applyStyles(parts, styles) {
        let result = [];
        for (let i = 0; i < parts.length; i++) {
            if (i > 0 && styles[i - 1]) {
                result.push({
                    text: parts[i],
                    style: parseStyleString(styles[i - 1])
                });
            } else {
                result.push({
                    text: parts[i],
                    style: null
                });
            }
        }
        return result;
    }
    
    function parseStyleString(styleStr) {
        if (!styleStr) return null;
        let styles = {};
        styleStr.split(';').forEach(rule => {
            let [prop, val] = rule.split(':');
            if (prop && val) {
                styles[prop.trim()] = val.trim();
            }
        });
        return styles;
    }
    
    // 添加消息到调试窗口
    function addToDebug(text, type, htmlContent = null, options = {}) {
        let warningUl = window._debugList || document.querySelector('.warning ul');
        if (!warningUl) {
            setTimeout(() => addToDebug(text, type, htmlContent, options), 10);
            return;
        }
        
        let indent = '';
        if (groupLevel > 0 && type !== 'groupend') {
            indent = '&nbsp;&nbsp;'.repeat(groupLevel);
        }
        
        let li;
        if (options.interactiveObject) {
            li = window._createDebugLi('', type, {
                indent: indent,
                interactiveObject: options.interactiveObject
            });
        } else {
            li = window._createDebugLi(text, type, {
                indent: indent,
                htmlContent: htmlContent,
                cssStyles: options.cssStyles,
                styledParts: options.styledParts
            });
        }
        
        window._debugCounter++;
        if (window._debugCounter > 0) {
            if (window._debugMessageExpand) {
                window._debugWarningBox.style.overflow = window._debugWarningBox.style.width = window._debugWarningBox.style.height = '';
                window._debugWarningBox.lastElementChild.style.opacity = '1';
                window._debugWarningBox.firstElementChild.style.display = 'none';
            } else {
                window._debugCountBox.innerHTML = window._debugCounter;
                window._debugCountBox.style.padding = '2px 8px';
            }
        }
        warningUl.appendChild(li);
        let lastLi = warningUl.lastElementChild;
        if (lastLi && window._debugAutoScroll) {
            lastLi.scrollIntoView(false);
        }
    }
    
    // 格式化带CSS的参数
    function formatWithCSS(args) {
        let parsed = parseCSSStyles(args);
        if (!parsed) return null;
        
        let styledParts = applyStyles(parsed.parts, parsed.styles);
        
        // 处理剩余参数
        let remainingText = '';
        if (parsed.remainingArgs.length > 0) {
            remainingText = ' ' + parsed.remainingArgs.map(arg => {
                let formatted = window._formatValue(arg);
                if (formatted && typeof formatted === 'object' && formatted._isObject) {
                    return '[Object]';
                }
                return String(formatted);
            }).join(' ');
        }
        
        // 将剩余参数添加到最后一个部分
        if (remainingText && styledParts.length > 0) {
            let lastPart = styledParts[styledParts.length - 1];
            lastPart.text += remainingText;
        }
        
        let text = styledParts.map(p => p.text).join('');
        
        return { text, styledParts };
    }
    
    // 处理通用参数（完全修复版 - 支持多参数）
    function processArgs(args, type) {
        let argsArray = Array.from(args);
        
        if (argsArray.length === 0) {
            addToDebug('', type, '');
            return;
        }
        
        // 检查是否包含 %c 样式
        let firstArg = argsArray[0];
        let hasCssStyle = typeof firstArg === 'string' && firstArg.includes('%c');
        
        if (hasCssStyle) {
            let cssResult = formatWithCSS(argsArray);
            if (cssResult) {
                addToDebug(cssResult.text, type, null, {
                    cssStyles: true,
                    styledParts: cssResult.styledParts
                });
                return;
            }
        }
        
        // 普通参数处理 - 将所有参数合并成一个字符串
        let allTexts = [];
        let objectsToShow = [];
        
        for (let i = 0; i < argsArray.length; i++) {
            let arg = argsArray[i];
            let formatted = window._formatValue(arg);
            
            if (formatted && typeof formatted === 'object' && formatted._isObject) {
                objectsToShow.push(formatted._value);
                allTexts.push(`[Object ${objectsToShow.length}]`);
            } else if (formatted && formatted !== '') {
                allTexts.push(String(formatted));
            }
        }
        
        // 合并所有文本
        if (allTexts.length > 0) {
            let combinedText = allTexts.join(' ');
            if (combinedText.trim()) {
                addToDebug(combinedText, type, window._escapeHtml(combinedText));
            }
        }
        
        // 单独为每个对象创建可展开的条目
        for (let i = 0; i < objectsToShow.length; i++) {
            addToDebug('', type, null, { interactiveObject: objectsToShow[i] });
        }
    }
    
    // 基础拦截
    console.log = function() {
        original.log.apply(console, arguments);
        processArgs(arguments, 'log');
    };
    
    console.warn = function() {
        original.warn.apply(console, arguments);
        processArgs(arguments, 'warn');
    };
    
    console.error = function() {
        original.error.apply(console, arguments);
        processArgs(arguments, 'error');
    };
    
    console.info = function() {
        original.info.apply(console, arguments);
        processArgs(arguments, 'info');
    };
    
    console.debug = function() {
        original.debug.apply(console, arguments);
        processArgs(arguments, 'debug');
    };
    
    // trace
    console.trace = function() {
        original.trace.apply(console, arguments);
        let stack = new Error().stack;
        let stackLines = stack.split('\n').slice(2, 15);
        let trace = stackLines.join('\n');
        let argsArray = Array.from(arguments);
        let argsStr = argsArray.map(arg => {
            let formatted = window._formatValue(arg);
            if (formatted && typeof formatted === 'object' && formatted._isObject) return '[Object]';
            return formatted;
        }).join(' ');
        let msg = `Trace: ${argsStr}\n${trace}`;
        addToDebug(msg, 'trace', window._escapeHtml(msg));
    };
    
    // table
    console.table = function(data) {
        original.table.apply(console, arguments);
        
        if (!data) return;
        
        let html = '<table style="border-collapse:collapse; font-size:11px; width:100%; background:#fff; color:#333; border-radius:4px; overflow:hidden">';
        
        if (Array.isArray(data)) {
            if (data.length === 0) {
                html += '<tr><td style="padding:8px; text-align:center; color:#888">(empty array)</td></tr>';
            } else {
                let columns = new Set();
                data.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        Object.keys(item).forEach(k => columns.add(k));
                    }
                });
                
                if (columns.size === 0) {
                    html += '<tr><th style="border:1px solid #ddd;padding:6px;background:#f0f0f0">Index</th><th style="border:1px solid #ddd;padding:6px;background:#f0f0f0">Value</th></tr>';
                    data.slice(0, 100).forEach((item, idx) => {
                        let displayVal = typeof item === 'object' ? JSON.stringify(item) : String(item);
                        html += `<tr><td style="border:1px solid #ddd;padding:6px">${idx}</td>
                                 <td style="border:1px solid #ddd;padding:6px">${window._escapeHtml(displayVal.substring(0, 100))}</td>
                                </tr>`;
                    });
                    if (data.length > 100) {
                        html += `<tr><td colspan="2" style="padding:6px; text-align:center; color:#888">... 还有 ${data.length - 100} 项</td></tr>`;
                    }
                } else {
                    let colArray = Array.from(columns).slice(0, 10);
                    html += '<tr>' + colArray.map(c => `<th style="border:1px solid #ddd;padding:6px;background:#f0f0f0;text-align:left">${window._escapeHtml(c)}</th>`).join('') + '</tr>';
                    
                    data.slice(0, 100).forEach((item) => {
                        if (typeof item === 'object' && item !== null) {
                            html += '<tr>' + colArray.map(c => {
                                let val = item[c];
                                let display = val !== undefined ? window._escapeHtml(String(val).substring(0, 100)) : '';
                                return `<td style="border:1px solid #ddd;padding:6px">${display}</td>`;
                            }).join('') + '</tr>';
                        }
                    });
                    if (data.length > 100) {
                        let colCount = colArray.length;
                        html += `<tr><td colspan="${colCount}" style="padding:6px; text-align:center; color:#888">... 还有 ${data.length - 100} 行</td></tr>`;
                    }
                }
            }
        } else if (typeof data === 'object' && data !== null) {
            let entries = Object.entries(data).slice(0, 100);
            html += '<tr><th style="border:1px solid #ddd;padding:6px;background:#f0f0f0">Key</th><th style="border:1px solid #ddd;padding:6px;background:#f0f0f0">Value</th></tr>';
            for (let [key, value] of entries) {
                let displayVal = typeof value === 'object' ? JSON.stringify(value).substring(0, 100) : String(value);
                html += `<tr><td style="border:1px solid #ddd;padding:6px">${window._escapeHtml(key)}</td>
                         <td style="border:1px solid #ddd;padding:6px">${window._escapeHtml(displayVal)}</td>
                         </tr>`;
            }
            if (Object.keys(data).length > 100) {
                html += `<tr><td colspan="2" style="padding:6px; text-align:center; color:#888">... 还有 ${Object.keys(data).length - 100} 个属性</td></tr>`;
            }
        }
        
        html += '</table>';
        addToDebug('', 'table', html);
    };
    
    // dir（使用可交互对象）
    console.dir = function(obj) {
    original.dir.apply(console, arguments);
    if (obj !== undefined) {
        if (obj instanceof HTMLElement) {
            addToDebug(obj.outerHTML, 'dir', window._escapeHtml(obj.outerHTML));
        } else {
            try {
                let jsonStr = JSON.stringify(obj, null, 2);
                addToDebug(jsonStr, 'dir', window._escapeHtml(jsonStr));
            } catch(e) {
                addToDebug(String(obj), 'dir', window._escapeHtml(String(obj)));
            }
        }
    }
};
    
    // dirxml
    if (console.dirxml) {
        console.dirxml = function(...args) {
            if (original.dirxml) original.dirxml.apply(console, args);
            
            for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                
                // 处理 DOM 元素
                if (arg instanceof HTMLElement) {
                    let li = window._createDebugLi('', 'dirxml', {
                        interactiveObject: arg
                    });
                    // 修改前缀
                    let prefixSpan = li.querySelector('span:first-child');
                    if (prefixSpan) {
                        prefixSpan.innerHTML = '[DIRXML] ';
                    }
                    window._appendToDebug(li);
                }
                // 处理普通对象（包括 {}）
                else if (typeof arg === 'object' && arg !== null) {
                    let li = window._createDebugLi('', 'dirxml', {
                        interactiveObject: arg
                    });
                    let prefixSpan = li.querySelector('span:first-child');
                    if (prefixSpan) {
                        prefixSpan.innerHTML = '[DIRXML] ';
                    }
                    window._appendToDebug(li);
                }
                // 处理基本类型
                else {
                    let formatted = window._formatValue(arg);
                    // 修改这里：不要截断长字符串
                    let displayText = typeof formatted === 'object' ? String(formatted) : formatted;
                    addToDebug(`Dirxml: ${displayText}`, 'dirxml', window._escapeHtml(`Dirxml: ${displayText}`));
                }
            }
        };
    }
    
    // group
    console.group = function(...args) {
        original.group.apply(console, args);
        let argsArray = Array.from(args);
        let label = argsArray.map(arg => {
            let f = window._formatValue(arg);
            if (f && typeof f === 'object' && f._isObject) return '[Object]';
            return f;
        }).join(' ') || 'group';
        addToDebug(`▼ ${label}`, 'group', window._escapeHtml(`▼ ${label}`));
        groupLevel++;
    };
    
    console.groupCollapsed = function(...args) {
        original.groupCollapsed.apply(console, args);
        let argsArray = Array.from(args);
        let label = argsArray.map(arg => {
            let f = window._formatValue(arg);
            if (f && typeof f === 'object' && f._isObject) return '[Object]';
            return f;
        }).join(' ') || 'group';
        addToDebug(`▶ ${label} (collapsed)`, 'group', window._escapeHtml(`▶ ${label} (collapsed)`));
        groupLevel++;
    };
    
    console.groupEnd = function() {
        original.groupEnd.apply(console);
        groupLevel = Math.max(0, groupLevel - 1);
        addToDebug('▲ group end', 'group', '▲ group end');
    };
    
    // count
    console.count = function(label = 'default') {
        original.count.apply(console, arguments);
        let count = (counters.get(label) || 0) + 1;
        counters.set(label, count);
        addToDebug(`${label}: ${count}`, 'count', window._escapeHtml(`${label}: ${count}`));
    };
    
    console.countReset = function(label = 'default') {
        original.countReset.apply(console, arguments);
        if (counters.has(label)) {
            counters.delete(label);
            addToDebug(`${label}: reset`, 'count', window._escapeHtml(`${label}: reset`));
        } else {
            addToDebug(`Count for '${label}' does not exist`, 'count', window._escapeHtml(`Count for '${label}' does not exist`));
        }
    };
    
    // time
    console.time = function(label = 'default') {
        original.time.apply(console, arguments);
        timers.set(label, performance.now());
        addToDebug(`${label}: timer started`, 'time', window._escapeHtml(`${label}: timer started`));
    };
    
    console.timeLog = function(label = 'default') {
        original.timeLog.apply(console, arguments);
        let start = timers.get(label);
        if (start) {
            let duration = performance.now() - start;
            addToDebug(`${label}: ${duration.toFixed(3)} ms`, 'time', window._escapeHtml(`${label}: ${duration.toFixed(3)} ms`));
        } else {
            addToDebug(`${label}: timer does not exist`, 'time', window._escapeHtml(`${label}: timer does not exist`));
        }
    };
    
    console.timeEnd = function(label = 'default') {
        original.timeEnd.apply(console, arguments);
        let start = timers.get(label);
        if (start) {
            let duration = performance.now() - start;
            addToDebug(`${label}: ${duration.toFixed(3)} ms (ended)`, 'time', window._escapeHtml(`${label}: ${duration.toFixed(3)} ms (ended)`));
            timers.delete(label);
        } else {
            addToDebug(`${label}: timer does not exist`, 'time', window._escapeHtml(`${label}: timer does not exist`));
        }
    };
    
    // assert
    console.assert = function(condition, ...args) {
        original.assert.apply(console, arguments);
        if (!condition) {
            let argsArray = Array.from(args);
            let msg = argsArray.map(arg => {
                let f = window._formatValue(arg);
                if (f && typeof f === 'object' && f._isObject) return '[Object]';
                return f;
            }).join(' ');
            addToDebug(`Assertion failed: ${msg}`, 'assert', window._escapeHtml(`Assertion failed: ${msg}`));
        }
    };
    
    // clear
    console.clear = function() {
        original.clear.apply(console);
        let warningUl = window._debugList || document.querySelector('.warning ul');
        if (warningUl) {
            warningUl.innerHTML = '';
        }
        addToDebug('Console cleared', 'clear', 'Console cleared');
    };
    
    // profile
        if (console.profile) {
            console.profile = function(label = 'default') {
                if (original.profile) original.profile.apply(console, arguments);
                
                let startTime = performance.now();
                let startMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
                let startStamp = Date.now();
                
                profiles.set(label, {
                    startTime: startTime,
                    startMemory: startMemory,
                    startStamp: startStamp
                });
                
                let msg = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📊 性能分析已启动 [${label}]
       开始时间: ${new Date(startStamp).toLocaleTimeString()}
    ${startMemory ? `   初始内存: ${(startMemory / 1048576).toFixed(2)} MB` : '   内存分析: 不可用'}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
                
                addToDebug(msg, 'profile', window._escapeHtml(msg));
            };
        }
        
        if (console.profileEnd) {
            console.profileEnd = function(label = 'default') {
                if (original.profileEnd) original.profileEnd.apply(console, arguments);
                
                let profile = profiles.get(label);
                if (profile) {
                    let endTime = performance.now();
                    let endMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
                    let duration = endTime - profile.startTime;
                    
                    let msg = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📈 性能分析报告 [${label}]
       执行时间: ${duration.toFixed(2)} ms
    ${profile.startMemory && endMemory ? `   内存变化: ${(profile.startMemory / 1048576).toFixed(2)} MB → ${(endMemory / 1048576).toFixed(2)} MB
       内存增量: ${((endMemory - profile.startMemory) / 1048576).toFixed(2)} MB` : '   内存分析: 不可用'}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
                    
                    addToDebug(msg, 'profile', window._escapeHtml(msg));
                    profiles.delete(label);
                } else {
                    addToDebug(`Profile '${label}' not found`, 'profile', window._escapeHtml(`Profile '${label}' not found`));
                }
            };
        }
        
        if (console.timeStamp) {
            console.timeStamp = function(label) {
                if (original.timeStamp) original.timeStamp.apply(console, arguments);
                let timestamp = performance.now();
                addToDebug(`⏱️ Timestamp: ${label || ''} @ ${timestamp.toFixed(2)}ms`, 'timestamp', window._escapeHtml(`⏱️ Timestamp: ${label || ''} @ ${timestamp.toFixed(2)}ms`));
            };
        }
})();

// ========== 第四步：捕获所有错误（融合版 - 包含 onerror 增强功能） ==========
(function() {
    // 避免重复安装标记
    if (window._errorHandlerFused) return;
    window._errorHandlerFused = true;
    
    let originalOnError = window.onerror;
    
    // ========== 统一错误处理函数 ==========
    function processError(errorInfo) {
        let warningUl = window._debugList || document.querySelector('.warning ul');
        if (!warningUl) return false;
        
        let { message, source, lineno, colno, error, isPromise, target } = errorInfo;
        
        // 提取错误类型和详细信息
        let errorType = error?.name || 'Error';
        let fullMessage = '';
        
        // 资源加载错误
        if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || 
            target.tagName === 'LINK' || target.tagName === 'VIDEO' || 
            target.tagName === 'AUDIO' || target.tagName === 'IFRAME')) {
            let url = target.src || target.href;
            fullMessage = `[ResourceError] 加载失败: ${target.tagName} - ${url}`;
            return addToDebugWindow(fullMessage, 'error');
        }
        
        // Promise 错误
        if (isPromise) {
            fullMessage = `[PromiseRejection] ${message}`;
            if (error?.stack) fullMessage += `\n${error.stack}`;
            return addToDebugWindow(fullMessage, 'error');
        }
        
        // JS 运行时错误
        if (error) {
            fullMessage = `[${errorType}] ${message}`;
            if (source) fullMessage += `\n  at ${source}:${lineno}:${colno || 0}`;
            if (error.stack) fullMessage += `\n${error.stack}`;
        } else {
            fullMessage = `[${errorType}] ${message}`;
            if (source) fullMessage += `\n  at ${source}:${lineno}:${colno || 0}`;
        }
        
        // 去重检查
        let existingErrors = warningUl.querySelectorAll('li');
        let isDuplicate = false;
        for (let i = existingErrors.length - 1; i >= Math.max(0, existingErrors.length - 5); i--) {
            if (existingErrors[i] && existingErrors[i].textContent.includes(message?.substring(0, 50))) {
                isDuplicate = true;
                break;
            }
        }
        
        if (!isDuplicate) {
            addToDebugWindow(fullMessage, 'error');
        }
        
        return false;
    }
    
    function addToDebugWindow(msg, type) {
        let li = window._createDebugLi(msg, type, {
            htmlContent: `❌ ${window._escapeHtml(msg)}`
        });
        window._appendToDebug(li);
        return false;
    }
    
    // ========== 统一使用 addEventListener（现代方式） ==========
    // 捕获 JS 运行时错误 + 资源加载错误
    window.addEventListener('error', function(event) {
        let errorInfo = {
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
            isPromise: false,
            target: event.target
        };
        
        // 调用统一处理函数
        return processError(errorInfo);
    });
    
    // 捕获 Promise 错误
    window.addEventListener('unhandledrejection', function(event) {
        let reason = event.reason;
        let message = '';
        let error = null;
        
        if (reason) {
            if (reason.stack) {
                message = reason.message || String(reason);
                error = reason;
            } else if (reason.message) {
                message = reason.message;
                error = reason;
            } else {
                message = String(reason);
            }
        } else {
            message = 'Unknown Promise rejection';
        }
        
        let errorInfo = {
            message: message,
            source: null,
            lineno: null,
            colno: null,
            error: error,
            isPromise: true,
            target: null
        };
        
        return processError(errorInfo);
    });
    
    // ========== 可选：保留 onerror 作为补充（仅用于兼容旧代码） ==========
    // 但通过标记避免重复，只在需要时启用
    window.onerror = function(message, source, lineno, colno, error) {
        // 调用统一处理函数
        let errorInfo = {
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error,
            isPromise: false,
            target: null
        };
        
        // 注意：这里可能会和上面的 addEventListener 重复
        // 但由于 processError 有去重机制，只会显示一次
        
        let result = processError(errorInfo);
        
        // 保留原始 onerror
        if (originalOnError) {
            return originalOnError(message, source, lineno, colno, error);
        }
        return result;
    };
})();

// ========== 第五步：网络请求错误捕获 ==========
(function() {
    function addNetworkError(msg) {
        let li = window._createDebugLi(msg, 'network', {
            htmlContent: `🌐 ${window._escapeHtml(msg)}`
        });
        window._appendToDebug(li);
    }
    
    // 捕获 XHR 错误
    let XHR = XMLHttpRequest.prototype;
    let originalOpen = XHR.open;
    let originalSend = XHR.send;
    
    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    
    XHR.send = function() {
        this.addEventListener('error', () => {
            addNetworkError(`XHR请求失败: ${this._method} ${this._url}`);
        });
        this.addEventListener('timeout', () => {
            addNetworkError(`XHR请求超时: ${this._method} ${this._url}`);
        });
        this.addEventListener('abort', () => {
            addNetworkError(`XHR请求中止: ${this._method} ${this._url}`);
        });
        return originalSend.apply(this, arguments);
    };
    
    // 捕获 Fetch 错误
    let originalFetch = window.fetch;
    if (originalFetch) {
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).catch(error => {
                addNetworkError(`Fetch请求失败: ${args[0]} - ${error.message}`);
                throw error;
            });
        };
    }
})();

// ========== 第六步：补充资源加载错误捕获 ==========
(function() {
    function addResourceError(url, tagName) {
        let li = window._createDebugLi(`加载失败: ${tagName} - ${url}`, 'resource', {
            htmlContent: `📦 ${window._escapeHtml(`加载失败: ${tagName} - ${url}`)}`
        });
        window._appendToDebug(li);
    }
    
    window.addEventListener('error', function(event) {
        let target = event.target;
        if (target && (target.tagName === 'IMG' || 
            target.tagName === 'SCRIPT' || 
            target.tagName === 'LINK' ||
            target.tagName === 'VIDEO' ||
            target.tagName === 'AUDIO' ||
            target.tagName === 'SOURCE' ||
            target.tagName === 'IFRAME')) {
            
            let url = target.src || target.href;
            if (url) {
                addResourceError(url, target.tagName);
            }
            event.stopPropagation();
            return false;
        }
    }, true);
})();

// ========== 第七步：补充 Worker 错误捕获 ==========
(function() {
    let originalWorker = window.Worker;
    if (originalWorker) {
        window.Worker = function(url) {
            let worker = new originalWorker(url);
            
            worker.addEventListener('error', function(event) {
                let li = window._createDebugLi(`Worker错误: ${event.message} at ${event.filename}:${event.lineno}`, 'worker', {
                    htmlContent: `👷 ${window._escapeHtml(`Worker错误: ${event.message} at ${event.filename}:${event.lineno}`)}`
                });
                window._appendToDebug(li);
            });
            
            return worker;
        };
        window.Worker.prototype = originalWorker.prototype;
    }
})();

// ========== 第八步：补充 WebSocket 错误捕获 ==========
(function() {
    let originalWebSocket = window.WebSocket;
    if (originalWebSocket) {
        window.WebSocket = function(...args) {
            let ws = new originalWebSocket(...args);
            
            ws.addEventListener('error', function(event) {
                let li = window._createDebugLi(`WebSocket错误: ${args[0]}`, 'websocket', {
                    htmlContent: `🔌 ${window._escapeHtml(`WebSocket错误: ${args[0]}`)}`
                });
                window._appendToDebug(li);
            });
            
            return ws;
        };
        window.WebSocket.prototype = originalWebSocket.prototype;
    }
})();

// ========== 第九步：补充 iframe 错误捕获（增强版，带详细日志） ==========
(function() {
    function captureIframeErrors(iframe) {
        try {
            let iframeWindow = iframe.contentWindow;
            if (iframeWindow && iframeWindow !== window) {
                // 捕获 iframe 内的错误事件
                iframeWindow.addEventListener('error', function(event) {
                    let errorMsg = event.message || 'Unknown error';
                    let li = window._createDebugLi(`iframe错误: ${errorMsg} at ${event.filename || 'unknown'}:${event.lineno || 0}`, 'iframe', {
                        htmlContent: `📄 ${window._escapeHtml(`iframe错误: ${errorMsg}`)}`
                    });
                    window._appendToDebug(li);
                });
                
                // 捕获 iframe 内的 Promise 错误
                iframeWindow.addEventListener('unhandledrejection', function(event) {
                    let errorMsg = event.reason?.message || String(event.reason) || 'Unknown Promise rejection';
                    let li = window._createDebugLi(`iframe Promise错误: ${errorMsg}`, 'iframe', {
                        htmlContent: `⚠️ ${window._escapeHtml(`iframe Promise错误: ${errorMsg}`)}`
                    });
                    window._appendToDebug(li);
                });
                
                console.log(`✅ 已成功绑定iframe错误监听: ${iframe.src || 'about:blank'} (同源)`);
            }
        } catch(e) {
            // ========== 详细的跨域错误日志（打印到控制台） ==========
            console.group(`🔒 跨域iframe访问被阻止 [${iframe.src || 'about:blank'}]`);
            console.warn(`   错误类型: 跨域安全限制 (Cross-Origin Security Policy)`);
            console.warn(`   错误详情: ${e.message || e}`);
            console.warn(`   iframe src: ${iframe.src || 'about:blank'}`);
            console.warn(`   当前页面: ${window.location.href}`);
            console.warn(`   说明: 由于浏览器的同源策略(CORS/SOP)，无法访问跨域iframe的内部错误`);
            console.warn(`   解决方案: 
      1. 在iframe页面中也添加此调试脚本
      2. 设置CORS头: Access-Control-Allow-Origin: *
      3. 使用 postMessage 进行跨域通信`);
            console.groupEnd();
            
            // 可选：在调试窗口中显示警告（标记为无法捕获）
            let warningMsg = `🔒 无法捕获跨域iframe错误: ${iframe.src || 'unknown'} - 浏览器同源策略限制`;
            let li = window._createDebugLi(warningMsg, 'warn', {
                htmlContent: `🔒 ${window._escapeHtml(warningMsg)}<br><span style="font-size:10px; opacity:0.8;">需要: 同源iframe或设置CORS头</span>`
            });
            window._appendToDebug(li);
        }
    }
    
    // 捕获现有 iframe
    function initIframeCapture() {
        let iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
            console.log(`📄 发现 ${iframes.length} 个iframe，开始绑定错误监听...`);
        }
        iframes.forEach(captureIframeErrors);
    }
    
    // 监听新添加的 iframe
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME') {
                    console.log(`📄 检测到新添加的iframe: ${node.src || 'about:blank'}`);
                    captureIframeErrors(node);
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('iframe').forEach(captureIframeErrors);
                }
            });
        });
    });
    
    if (document.body) {
        initIframeCapture();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            initIframeCapture();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();

// ========== 第十步：补充 Vue 错误捕获 ==========
(function() {
    window.addEventListener('error', function(event) {
        if (event.message && (event.message.includes('Vue') || event.message.includes('vue'))) {
            let warningUl = window._debugList || document.querySelector('.warning ul');
            if (warningUl && !warningUl.querySelector('[data-error-type="vue"]')) {
                let li = window._createDebugLi(event.message, 'vue', {
                    htmlContent: `🟢 ${window._escapeHtml(event.message)}`,
                    attributes: { 'data-error-type': 'vue' }
                });
                window._appendToDebug(li);
            }
        }
    });
})();

// ========== 第十一步：补充 React 错误捕获 ==========
(function() {
    window.addEventListener('error', function(event) {
        if (event.message && (event.message.includes('React') || event.message.includes('react'))) {
            let warningUl = window._debugList || document.querySelector('.warning ul');
            if (warningUl && !warningUl.querySelector('[data-error-type="react"]')) {
                let li = window._createDebugLi(event.message, 'react', {
                    htmlContent: `⚛️ ${window._escapeHtml(event.message)}`,
                    attributes: { 'data-error-type': 'react' }
                });
                window._appendToDebug(li);
            }
        }
    });
})();

// ========== 第十二步：提供手动添加方法 ==========
window.add_warning = function(...args) {
    // 固定类型为 'add_warning'，不使用参数传递的类型
    let type = 'add_warning';  // ← 关键修改：固定类型
    let contentArgs = args;     // 所有参数都是内容，不再有类型参数
    
    // 如果没有内容，添加空行
    if (contentArgs.length === 0) {
        let li = window._createDebugLi('', type);
        window._appendToDebug(li);
        return;
    }
    
    // 检查是否包含 %c 样式
    let firstContentArg = contentArgs[0];
    let hasCssStyle = typeof firstContentArg === 'string' && firstContentArg.includes('%c');
    
    if (hasCssStyle) {
        let cssResult = parseCSSStylesForWarning(contentArgs);
        if (cssResult) {
            let li = window._createDebugLi(cssResult.resultText, type, {
                cssStyles: true,
                styledParts: cssResult.styledParts
            });
            window._appendToDebug(li);
            return;
        }
    }
    
    // 普通参数处理 - 将所有参数合并
    let allTexts = [];
    let objectsToShow = [];
    
    for (let i = 0; i < contentArgs.length; i++) {
        let arg = contentArgs[i];
        let formatted = window._formatValue(arg);
        
        if (formatted && typeof formatted === 'object' && formatted._isObject) {
            objectsToShow.push(formatted._value);
            allTexts.push(`[Object ${objectsToShow.length}]`);
        } else if (formatted && formatted !== '') {
            allTexts.push(String(formatted));
        }
    }
    
    // 合并所有文本
    if (allTexts.length > 0) {
        let combinedText = allTexts.join(' ');
        if (combinedText.trim()) {
            let li = window._createDebugLi(combinedText, type);
            window._appendToDebug(li);
        }
    }
    
    // 单独为每个对象创建可展开的条目
    for (let i = 0; i < objectsToShow.length; i++) {
        let li = window._createDebugLi('', type, {
            interactiveObject: objectsToShow[i]
        });
        window._appendToDebug(li);
    }
};

// ========== 第十三步：性能分析工具 ==========
window.performanceAnalyzer = {
    startMonitoring: function(label = 'default') {
        if (!window._performanceData) window._performanceData = {};
        window._performanceData[label] = {
            startTime: performance.now(),
            startMemory: performance.memory ? performance.memory.usedJSHeapSize : null,
            fps: [],
            lastFrameTime: performance.now(),
            frameCount: 0,
            rafId: null
        };
        
        let data = window._performanceData[label];
        let monitorFPS = (timestamp) => {
            if (!window._performanceData[label]) return;
            data.frameCount++;
            let now = performance.now();
            let elapsed = now - data.lastFrameTime;
            if (elapsed >= 1000) {
                let fps = (data.frameCount * 1000) / elapsed;
                data.fps.push(fps);
                data.frameCount = 0;
                data.lastFrameTime = now;
            }
            data.rafId = requestAnimationFrame(monitorFPS);
        };
        data.rafId = requestAnimationFrame(monitorFPS);
        
        console.log(`📊 性能监控已启动: ${label}`);
    },
    
    endMonitoring: function(label = 'default') {
        let data = window._performanceData?.[label];
        if (!data) {
            console.warn(`未找到监控数据: ${label}`);
            return;
        }
        
        if (data.rafId) {
            cancelAnimationFrame(data.rafId);
        }
        
        let endTime = performance.now();
        let endMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
        let duration = endTime - data.startTime;
        let avgFPS = data.fps.length > 0 ? data.fps.reduce((a, b) => a + b, 0) / data.fps.length : 0;
        let minFPS = data.fps.length > 0 ? Math.min(...data.fps) : 0;
        let maxFPS = data.fps.length > 0 ? Math.max(...data.fps) : 0;
        
        let report = `
╔══════════════════════════════════════════════════════════╗
║                    性能分析报告                           ║
╠══════════════════════════════════════════════════════════╣
║ 标签: ${label.padEnd(44)}║
║ 执行时间: ${duration.toFixed(2)} ms${' '.repeat(44 - duration.toFixed(2).length - 12)}║
║ 平均FPS: ${avgFPS.toFixed(1)}${' '.repeat(44 - avgFPS.toFixed(1).length - 9)}║
║ 最低FPS: ${minFPS.toFixed(1)}${' '.repeat(44 - minFPS.toFixed(1).length - 9)}║
║ 最高FPS: ${maxFPS.toFixed(1)}${' '.repeat(44 - maxFPS.toFixed(1).length - 9)}║
${data.startMemory && endMemory ? `║ 初始内存: ${(data.startMemory / 1048576).toFixed(2)} MB${' '.repeat(44 - (data.startMemory / 1048576).toFixed(2).length - 13)}║
║ 最终内存: ${(endMemory / 1048576).toFixed(2)} MB${' '.repeat(44 - (endMemory / 1048576).toFixed(2).length - 13)}║
║ 内存增量: ${((endMemory - data.startMemory) / 1048576).toFixed(2)} MB${' '.repeat(44 - ((endMemory - data.startMemory) / 1048576).toFixed(2).length - 13)}║` : '║ 内存分析: 不可用（需要 --enable-precise-memory-info）║'}
╚══════════════════════════════════════════════════════════╝`;
        
        console.log(report);
        delete window._performanceData[label];
    }
};

console.log('✅调试系统已启动');