// initialization function
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchPanel = document.getElementById('searchPanel');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const closeSearch = document.getElementById('closeSearch');

    searchToggle.addEventListener('click', () => searchPanel.classList.add('active'));

    closeSearch.addEventListener('click', () => {
        searchPanel.classList.remove('active');
    
        // clean the highlight area
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    
        // clean the input area
        searchInput.value = '';
    
        // clean the result area
        document.getElementById('searchResults').innerHTML = '';
    });
    

    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    searchButton.addEventListener('click', performSearch);
}

// when the page is loaded
document.addEventListener('DOMContentLoaded', initSearch);

// search function
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const content = document.getElementById('content');
    const resultsInfo = document.getElementById('searchResults');
    
    // clean the previous highlight area
    const highlights = content.querySelectorAll('.highlight');
    highlights.forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
    
    // if the search area is empty
    if (!searchTerm) {
        resultsInfo.textContent = '';
        return;
    }
    
    // find all text nods
    const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let matchCount = 0;
    const nodesWithMatches = [];
    
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(searchTerm)) {
            nodesWithMatches.push(node);
            matchCount += node.textContent.split(searchTerm).length - 1;
        }
    }
    
    // process the result
    if (matchCount > 0) {
        nodesWithMatches.forEach(node => {
            const span = document.createElement('span');
            const text = node.textContent;
            const regex = new RegExp(searchTerm, 'gi');
            const newText = text.replace(regex, match => 
                `<span class="highlight">${match}</span>`
            );
            
            span.innerHTML = newText;
            node.parentNode.replaceChild(span, node);
        });
        
        // scroll to first result
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // additional visual effect
            firstHighlight.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                firstHighlight.style.backgroundColor = 'yellow';
            }, 1000);
        }
        
        resultsInfo.innerHTML = `Tapıldı: <strong>${matchCount}</strong> nəticə`;
    } else {
        resultsInfo.innerHTML = `<span style="color:red">"${searchTerm}" üçün heç bir nəticə tapılmadı</span>`;
    } 
}