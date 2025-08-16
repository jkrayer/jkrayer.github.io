// Close mobile navigation menu when a navigation link is clicked
document.addEventListener("DOMContentLoaded", function () {
  const navigation = document.querySelector(".root-navigation");
  const navigationCheckbox = document.getElementById("root-navigation-check");

  navigation.addEventListener("click", (e) => {
    console.log(e.target);
    if (Array.from(e.target.classList).includes("root-navigation-link")) {
      // Uncheck the navigation checkbox to close the menu
      navigationCheckbox.checked = false;
    }
  });
});

// Snap scrolling functionality for root-article elements
/*
document.addEventListener("DOMContentLoaded", function () {
  const articles = document.querySelectorAll(".root-article");
  let isSnapping = false;
  let scrollTimeout;

  // Throttle scroll events to improve performance
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Find the closest article to the current viewport
  function findClosestArticle() {
    const viewportCenter = window.innerHeight / 2;
    let closestArticle = null;
    let closestDistance = Infinity;

    articles.forEach((article) => {
      const rect = article.getBoundingClientRect();
      const articleCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - articleCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestArticle = article;
      }
    });

    return closestArticle;
  }

  // Smooth scroll to article
  function snapToArticle(article) {
    if (!article || isSnapping) return;
    
    isSnapping = true;
    article.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Reset snapping flag after animation completes
    setTimeout(() => {
      isSnapping = false;
    }, 800);
  }

  // Handle scroll events with debouncing
  function handleScroll() {
    if (isSnapping) return;

    // Clear previous timeout
    clearTimeout(scrollTimeout);
    
    // Set new timeout to trigger snap after scroll stops
    scrollTimeout = setTimeout(() => {
      const closestArticle = findClosestArticle();
      
      // Only snap if the article is not already mostly in view
      if (closestArticle) {
        const rect = closestArticle.getBoundingClientRect();
        const threshold = window.innerHeight * 0.3; // 30% threshold
        
        // If the article is not well-positioned, snap to it
        if (Math.abs(rect.top) > threshold) {
          snapToArticle(closestArticle);
        }
      }
    }, 150); // Wait 150ms after scroll stops
  }

  // Add throttled scroll listener
  window.addEventListener('scroll', throttle(handleScroll, 50));
});
*/
