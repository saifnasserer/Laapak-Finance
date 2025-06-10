
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const headerPlaceholder = document.querySelector('#header-placeholder');
    if (headerPlaceholder) {
        // The path to the header component is relative to the HTML files in the /views/ directory
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                
                // Get the current page's filename (e.g., "dashboard.html")
                const currentPage = window.location.pathname.split('/').pop();
                const navLinks = document.querySelectorAll('#header-placeholder .nav-link');
                
                let isPageFound = false;
                navLinks.forEach(link => {
                    const linkPage = link.getAttribute('href').split('/').pop();
                    if (linkPage === currentPage) {
                        link.classList.add('active');
                        isPageFound = true;
                    } else {
                        link.classList.remove('active');
                    }
                });

                // If no specific page is matched (e.g., at the root), default to highlighting Dashboard
                if (!isPageFound && (currentPage === '' || currentPage.endsWith('views/'))) {
                    const dashboardLink = document.querySelector('#header-placeholder .nav-link[href*="dashboard.html"]');
                    if(dashboardLink) dashboardLink.classList.add('active');
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = '<p class="text-danger text-center">Failed to load header</p>';
            });
    }
});