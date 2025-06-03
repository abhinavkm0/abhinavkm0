let allArticles = [];
let selectedTags = new Set();
let tagCounts = {};

document.addEventListener('DOMContentLoaded', async () => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    if (tagParam) {
    tagParam.split(',').forEach(tag => selectedTags.add(tag.trim()));
    }

    await loadArticlesAndTags();
    updateUI();
});

async function loadArticlesAndTags() {
    try {
    const response = await fetch('../data/posts.json');
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    
    allArticles = await response.json();
    
    // Calculate tag counts
    tagCounts = {};
    allArticles.forEach(article => {
        article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    renderTagsGrid();
    
    } catch (error) {
    console.error('Error loading articles:', error);
    document.getElementById('tagsGrid').innerHTML = `
        <div class="no-results">Failed to load tags. Please try again later.</div>
    `;
    }
}

function renderTagsGrid() {
    const tagsGrid = document.getElementById('tagsGrid');
    const sortedTags = Object.keys(tagCounts).sort();
    
    tagsGrid.innerHTML = sortedTags.map(tag => `
    <div class="tag-item ${selectedTags.has(tag) ? 'selected' : ''}" data-tag="${tag}">
        <div class="tag-content">
        <span class="tag-name">${tag}</span>
        <span class="tag-count">${tagCounts[tag]}</span>
        </div>
    </div>
    `).join('');

    // Add click listeners
    tagsGrid.querySelectorAll('.tag-item').forEach(item => {
    item.addEventListener('click', () => {
        const tag = item.dataset.tag;
        toggleTag(tag);
    });
    });
}

function toggleTag(tag) {
    if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
    } else {
    selectedTags.add(tag);
    }
    updateUI();
}

function updateUI() {
    updateSelectedTags();
    updateTagsGrid();
    filterAndDisplayArticles();
    updateURL();
}

function updateSelectedTags() {
    const selectedTagsContainer = document.getElementById('selectedTags');
    
    if (selectedTags.size === 0) {
    selectedTagsContainer.innerHTML = '<span class="empty-selection">No tags selected</span>';
    } else {
    selectedTagsContainer.innerHTML = Array.from(selectedTags).map(tag => `
        <span class="selected-tag">
        ${tag}
        <button class="remove-tag" data-tag="${tag}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        </span>
    `).join('');

    // Add remove listeners
    selectedTagsContainer.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = btn.dataset.tag;
        selectedTags.delete(tag);
        updateUI();
        });
    });
    }
}

function updateTagsGrid() {
    document.querySelectorAll('.tag-item').forEach(item => {
    const tag = item.dataset.tag;
    item.classList.toggle('selected', selectedTags.has(tag));
    });
}

function filterAndDisplayArticles() {
    const filteredArticlesSection = document.getElementById('filteredArticles');
    const articlesList = document.getElementById('articlesList');
    const articleCount = document.getElementById('articleCount');

    if (selectedTags.size === 0) {
    filteredArticlesSection.style.display = 'none';
    return;
    }

    // Filter articles that have ALL selected tags
    const filteredArticles = allArticles.filter(article => 
    Array.from(selectedTags).every(tag => article.tags.includes(tag))
    );

    filteredArticlesSection.style.display = 'block';
    articleCount.textContent = filteredArticles.length;

    if (filteredArticles.length === 0) {
    articlesList.innerHTML = '<div class="no-results">No articles found with the selected tags.</div>';
    return;
    }

    // Sort by date (newest first)
    filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    articlesList.innerHTML = filteredArticles.map(article => {
    const formattedDate = formatDate(article.date);
    return `
        <div class="article-card">
        <div class="article-thumbnail">
            <img src="${article.coverImage}" alt="${article.title}" loading="lazy">
        </div>
        <div class="article-content">
            <a href="${article.url}" class="article-title">${article.title}</a>
            <p class="article-description">${article.description}</p>
            <div class="article-tags">
            ${article.tags.slice(0, 6).map(tag => `
                <span class="tag ${selectedTags.has(tag) ? 'highlighted' : ''}" data-tag="${tag}">${tag}</span>
            `).join('')}
            </div>
        </div>
        </div>
    `;
    }).join('');

    // Add click listeners to tags in articles
    articlesList.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const tagName = tag.dataset.tag;
        if (!selectedTags.has(tagName)) {
        selectedTags.add(tagName);
        updateUI();
        }
    });
    });
}

function updateURL() {
    const url = new URL(window.location);
    if (selectedTags.size > 0) {
    url.searchParams.set('tag', Array.from(selectedTags).join(','));
    } else {
    url.searchParams.delete('tag');
    }
    window.history.replaceState({}, '', url);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Clear filters button
document.getElementById('clearFilters').addEventListener('click', () => {
    selectedTags.clear();
    updateUI();
});