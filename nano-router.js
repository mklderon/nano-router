export class Router {
  constructor(mountPoint) {
    this.mountPoint = mountPoint;
    this.routes = new Map();
    this.currentCleanup = null;
    this.currentPath = null;
  }

  // Nuevo: registrar rutas con parámetros
  register(path, page) {
    const paramNames = [];
    const regex = new RegExp(
      '^' +
      path
        .split('/')
        .map(seg => {
          if (seg.startsWith(':')) {
            paramNames.push(seg.slice(1));
            return '([^/]+)';
          }
          return seg;
        })
        .join('/') +
      '$'
    );
    this.routes.set({ regex, paramNames }, page);
  }

  // Nuevo: extraer parámetros de la URL
  extractParams(path) {
    for (const [{ regex, paramNames }, page] of this.routes.entries()) {
      const match = path.match(regex);
      if (match) {
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { page, params };
      }
    }
    return null;
  }

  async navigate(path) {
    if (this.currentPath === path) return;

    if (this.currentCleanup) {
      this.currentCleanup();
    }

    const route = this.extractParams(path);
    if (!route) {
      console.error(`Ruta no encontrada: ${path}`);
      return;
    }

    const { page, params } = route;
    this.currentPath = path;

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    document.querySelectorAll('nav a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === path.split('/').slice(0, 3).join('/'));
    });

    const container = document.querySelector(this.mountPoint);
    if (!container) {
      console.error(`Punto de montaje no encontrado: ${this.mountPoint}`);
      return;
    }

    if (page.html) {
      try {
        const response = await fetch(page.html);
        const html = await response.text();
        container.innerHTML = html;
      } catch (e) {
        console.error('Error al cargar HTML:', e);
        container.innerHTML = '<p>Error al cargar la página</p>';
        return;
      }
    }

    if (page.init) {
      this.currentCleanup = page.init(container, params);
    }
  }

  init() {
    const path = window.location.pathname === '' || window.location.pathname === '/'
      ? '/'
      : window.location.pathname;

    this.navigate(path);

    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="/"]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        this.navigate(href);
      }
    });
  }
}
