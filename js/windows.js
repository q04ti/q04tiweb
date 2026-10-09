/**
 * q04tiOS - Window Manager
 * Handles draggable windows, z-indexing, minimization, maximization, and taskbar integration.
 */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.highestZ = 100;
    this.activeWindowId = null;
    this.init();
  }

  init() {
    document.querySelectorAll('.os-window').forEach((winEl) => {
      const id = winEl.id;
      this.windows.set(id, {
        element: winEl,
        isMinimized: winEl.classList.contains('hidden'),
        isMaximized: false,
        prevRect: null
      });

      this.setupDragging(winEl);
      this.setupControls(winEl);

      winEl.addEventListener('pointerdown', () => {
        this.focusWindow(id);
      });
    });

    // Close any start menu if clicked outside
    document.addEventListener('pointerdown', (e) => {
      const startMenu = document.getElementById('start-menu');
      const startBtn = document.getElementById('start-btn');
      if (startMenu && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      }
    });
  }

  setupDragging(winEl) {
    const titleBar = winEl.querySelector('.window-titlebar');
    if (!titleBar) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    titleBar.addEventListener('pointerdown', (e) => {
      // Don't drag if clicked on buttons
      if (e.target.closest('.window-btn')) return;

      const id = winEl.id;
      const winData = this.windows.get(id);
      if (winData && winData.isMaximized) return;

      isDragging = true;
      this.focusWindow(id);

      titleBar.setPointerCapture(e.pointerId);

      const rect = winEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      titleBar.style.cursor = 'grabbing';
      e.preventDefault();
    });

    titleBar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Keep inside bounds
      const maxLeft = window.innerWidth - 60;
      const maxTop = window.innerHeight - 80;
      newLeft = Math.max(-100, Math.min(newLeft, maxLeft));
      newTop = Math.max(10, Math.min(newTop, maxTop));

      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
      winEl.style.transform = 'none';
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      titleBar.style.cursor = 'grab';
      try {
        titleBar.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    titleBar.addEventListener('pointerup', endDrag);
    titleBar.addEventListener('pointercancel', endDrag);
  }

  setupControls(winEl) {
    const id = winEl.id;

    const closeBtn = winEl.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(id);
      });
    }

    const minBtn = winEl.querySelector('.btn-minimize');
    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(id);
      });
    }

    const maxBtn = winEl.querySelector('.btn-maximize');
    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(id);
      });
    }
  }

  openWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playOpen();

    winData.element.classList.remove('hidden');
    winData.isMinimized = false;
    this.focusWindow(id);
    this.updateTaskbar();

    // On mobile, if opened, position nicely
    if (window.innerWidth < 640) {
      winData.element.style.top = '20px';
      winData.element.style.left = '10px';
      winData.element.style.transform = 'none';
    }
  }

  closeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClose();

    winData.element.classList.add('hidden');
    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }
    this.updateTaskbar();
  }

  minimizeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClick();

    winData.isMinimized = true;
    winData.element.classList.add('hidden');
    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }
    this.updateTaskbar();
  }

  toggleMaximize(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClick();

    if (!winData.isMaximized) {
      // Save prev position
      winData.prevRect = {
        top: winData.element.style.top,
        left: winData.element.style.left,
        width: winData.element.style.width,
        height: winData.element.style.height,
        transform: winData.element.style.transform
      };
      winData.element.classList.add('maximized');
      winData.isMaximized = true;
    } else {
      winData.element.classList.remove('maximized');
      if (winData.prevRect) {
        winData.element.style.top = winData.prevRect.top;
        winData.element.style.left = winData.prevRect.left;
        winData.element.style.width = winData.prevRect.width;
        winData.element.style.height = winData.prevRect.height;
        winData.element.style.transform = winData.prevRect.transform;
      }
      winData.isMaximized = false;
    }
  }

  focusWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    this.highestZ += 2;
    winData.element.style.zIndex = this.highestZ;

    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('active-window'));
    winData.element.classList.add('active-window');
    this.activeWindowId = id;
    this.updateTaskbar();
  }

  updateTaskbar() {
    const taskbarTasks = document.getElementById('taskbar-tasks');
    if (!taskbarTasks) return;

    taskbarTasks.innerHTML = '';

    this.windows.forEach((data, id) => {
      const isHidden = data.element.classList.contains('hidden');
      if (!isHidden || data.isMinimized) {
        const title = data.element.querySelector('.window-title')?.innerText || id;
        const iconSvg = data.element.dataset.icon || '📁';

        const btn = document.createElement('button');
        btn.className = `task-button ${this.activeWindowId === id && !data.isMinimized ? 'active' : ''}`;
        btn.innerHTML = `<span class="task-icon">${iconSvg}</span> <span class="task-name">${title}</span>`;
        btn.addEventListener('click', () => {
          if (data.isMinimized) {
            this.openWindow(id);
          } else if (this.activeWindowId === id) {
            this.minimizeWindow(id);
          } else {
            this.focusWindow(id);
          }
        });
        taskbarTasks.appendChild(btn);
      }
    });
  }
}

window.windowManager = null;
