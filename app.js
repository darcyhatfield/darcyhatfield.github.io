initModalTriggers();

// SPA Navigation with Fade Effect
document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('.nav-link');

    function fadeOut(element, callback) {
        element.style.transition = 'opacity 0.3s';
        element.style.opacity = 0;
        setTimeout(callback, 300);
    }

    function fadeIn(element) {
        element.style.transition = 'opacity 0.3s';
        element.style.opacity = 1;
    }

    function loadPage(url, addToHistory = true) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Extract only the <main> content from the fetched HTML
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const newContent = temp.querySelector('#content');
                if (newContent) {
                    fadeOut(content, () => {
                        content.innerHTML = newContent.innerHTML;
                        fadeIn(content);
                        initModalTriggers();
                    });
                }
                if (addToHistory) {
                    history.pushState({ url: url }, '', url);
                }
            });
    }

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            loadPage(url);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.url) {
            loadPage(e.state.url, false);
        }
    });
});

// Highlight active navigation link
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-bar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Modal Functionality
function initModalTriggers() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal .close');
    const projectLinks = document.querySelectorAll('.project');
    const overlay = document.querySelector('.modal .overlay');
    const title = document.querySelector('.modal .modal-title');

    if (!modal || !modalBody || !closeBtn || projectLinks.length === 0 || !overlay || !title) {
        return;
    }

    projectLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const project = this.getAttribute('data-project');
            const modaltitle = this.getAttribute('data-title');
            fetch('/projects/' + project + '.html')
                .then(response => response.text())
                .then(html => {
                    modalBody.innerHTML = html;
                    modal.style.display = 'block';                    
                    // window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.body.classList.add('modal-open');
                    title.innerText = modaltitle;
                });
        });
    });

    overlay.addEventListener('click', function (e) {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        document.body.classList.remove('modal-open');
        // window.scrollTo({ top: lastScrollY, behavior: 'smooth' });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        document.body.classList.remove('modal-open');
        // window.scrollTo({ top: lastScrollY, behavior: 'smooth' });
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalBody.innerHTML = '';
            document.body.classList.remove('modal-open');
            // window.scrollTo({ top: lastScrollY, behavior: 'smooth' });
        }
    });
}