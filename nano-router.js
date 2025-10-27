export class Router {
  constructor(mountPoint) {
    this.mountPoint = mountPoint;
    this.routes = new Map();
    this.currentCleanup = null;
    this.currentPath = null;
  }

  register(path, page) {
    this.routes.set(path, page);
  }

  async navigate(path) {
    if (this.currentPath === path) return;

    if (this.currentCleanup) {
      this.currentCleanup();
    }

    const page = this.routes.get(path);
    if (!page) {
      console.error(`Ruta no encontrada: ${path}`);
      return;
    }

    this.currentPath = path;

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    document.querySelectorAll('nav a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === path);
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
      this.currentCleanup = page.init(container);
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