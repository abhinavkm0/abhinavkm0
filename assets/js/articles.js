document.addEventListener('DOMContentLoaded', async () => {
    try {
    // Fetch the articles data
    const response = await fetch('../data/posts.json');
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    
    const articles = await response.json();
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get the articles container
    const articlesListElement = document.getElementById('articlesList');
    
    // Clear loading message
    articlesListElement.innerHTML = '';
    
    if (articles.length === 0) {
        articlesListElement.innerHTML = '<div class="no-articles">No articles found</div>';
        return;
    }
    
    // Render each article
    articles.forEach(article => {
        const formattedDate = formatDate(article.date);
        
        const articleElement = document.createElement('div');
        articleElement.className = 'article-card';
        
        articleElement.innerHTML = `
        <div class="article-thumbnail">
            <img src="${article.coverImage}" alt="${article.title}" loading="lazy">
        </div>
        <div class="article-content">
            <a href="${article.url}" class="article-title">${article.title}</a>
            <p class="article-description">${article.description}</p>
            <div class="article-tags">
            ${article.tags.slice(0, 4).map(tag => `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
            ${article.tags.length > 4 ? `<span class="tag">+${article.tags.length - 4}</span>` : ''}
            </div>
            <div class="article-meta">
            <div class="article-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                ${formattedDate}
            </div>
            <div class="article-read-time">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${article.readTime}
            </div>
            </div>
        </div>
        `;
        
        articlesListElement.appendChild(articleElement);
    });
    
    } catch (error) {
    console.error('Error loading articles:', error);
    document.getElementById('articlesList').innerHTML = `
        <div class="no-articles">
        Failed to load articles. Please try again later.
        </div>
    `;
    }
});

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}