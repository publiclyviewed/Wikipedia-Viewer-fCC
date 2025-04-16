// Trigger search functionality when "Search" button is clicked
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchBox').value.trim();
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}&origin=*`;
  
    if (!query) return;
  
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
  
        // No search results
        if (data.query.search.length === 0) {
          resultsDiv.innerHTML = `
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <p class="card-text">No results found for "<strong>${query}</strong>". Please try another search.</p>
                </div>
              </div>
            </div>`;
          document.body.style.backgroundImage = "url('https://i.ytimg.com/vi/7RIEfMqhBR4/maxresdefault.jpg')";
          return;
        }
  
        // If results exist, render them
        data.query.search.forEach(item => {
          const resultLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`;
          const resultHtml = `
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text">${item.snippet}...</p>
                  <a href="${resultLink}" class="btn btn-info" target="_blank">Read More</a>
                </div>
              </div>
            </div>`;
          resultsDiv.innerHTML += resultHtml;
        });
  
        // Try to fetch background image from the first result
        const firstTitle = data.query.search[0].title;
        const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(firstTitle)}&pithumbsize=1000&origin=*`;
  
        fetch(imageUrl)
          .then(res => res.json())
          .then(imgData => {
            const pages = imgData.query.pages;
            const page = Object.values(pages)[0];
            if (page.thumbnail && page.thumbnail.source) {
              document.body.style.backgroundImage = `url('${page.thumbnail.source}')`;
            } else {
              // fallback if no image
              document.body.style.backgroundImage = "url('https://i.ytimg.com/vi/7RIEfMqhBR4/maxresdefault.jpg')";
            }
          })
          .catch(err => {
            console.error('Image fetch error:', err);
            document.body.style.backgroundImage = "url('https://i.ytimg.com/vi/7RIEfMqhBR4/maxresdefault.jpg')";
          });
      })
      .catch(err => {
        console.error('Search error:', err);
      });
  });
  
  // Allow search on Enter key press
  document.getElementById('searchBox').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      document.getElementById('searchButton').click();
    }
  });
  
  // Open a random Wikipedia article in a new tab
  document.getElementById('randomButton').addEventListener('click', function() {
    const randomUrl = `https://en.wikipedia.org/wiki/Special:Random`;
    window.open(randomUrl, '_blank');
  });
  
  // Clear search input and results
  document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('searchBox').value = '';
    document.getElementById('results').innerHTML = '';
    document.body.style.backgroundImage = "url('https://i.ytimg.com/vi/7RIEfMqhBR4/maxresdefault.jpg')";
  });
  