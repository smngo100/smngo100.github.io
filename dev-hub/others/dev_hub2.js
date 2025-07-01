const headerCategories = [
  {
    name: 'Frontend',
    languages: ['HTML/CSS', 'JavaScript', 'TypeScript'],
  },
  {
    name: 'Backend',
    languages: ['C++', 'Java', 'Python']
  },
  {
    name: 'UI/UX',
    languages: ['Figma', 'Wordflow', 'Framer']
  },
];

const resourceTypeLabels = {
  learning: 'Learning Platforms',
  tools: 'Tools & Frameworks',
  books: 'Books & Gudies',
  practice: 'Pratice & Projects'
}

const languageResources = {
  'HTML/CSS':
  {
    learning: ['SuperSimpleDev', 'asdfkjs'],
    tools: ['VS Code'],
    books: ['HTML CSS Book'],
    practice: ['HMTL CSS practice stuff']
  },
  'JavaScript': 
  {
    learning: ['dfkjgdsf'],
    tools: ['hpoiptro'],
    books: ['cvmcnvbxm'],
    practice: ['apsdf']
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
let headerHTML = '';
let languagesHTML = '';

headerCategories.forEach(category => {
  headerHTML += `
    <button class="category-button js-category-button" 
      data-category="${category.name}">
      ${category.name}
    </button>
  `;

  const languagesArray = category.languages;
  languagesArray.forEach(lang => {
    languagesHTML += `
      <button class="language-button js-language-button" 
        data-category="${category.name}" 
        data-language="${lang}">
        ${lang}
      </button>
    `;
  });
});

let cardContentHTML = '';
Object.entries(languageResources).forEach(([language, resources]) => {
  cardContentHTML += `<div class="language-content" data-language="${language}">`
  
  Object.entries(resources).forEach(([resourceType, sources]) => {
    cardContentHTML += `
      <div class="resource-selection">
        <div class="card">
        <h4 class="card-title">${resourceType}</h4>
    `;

    sources.forEach(source => {
      cardContentHTML += `<a class="link">${source}</a>`
    });

    cardContentHTML += `
        </div>
      </div> 
    `;
  });

  cardContentHTML += `</div>`;
});

//////////////////////////////////////////////////////////////////////////////////////////////////

const devHubHTML = `
  <header>
    ${headerHTML}
  </header>

  <div class="languages-header">
    ${languagesHTML}
  </div>

  <section class="resource-content-container"> 
    <div class="resource-title-content">
        <h3 class="resource-title">------- Resources</h3>
        <div class="resource-page-description">Curated resources for ----------</div>
    </div>

    ${cardContentHTML}
  </section>
`;
document.querySelector('.js-dev-hub').innerHTML = devHubHTML;

//////////////////////////////////////////////////////////////////////////////////////////////////

////////// Event listeners //////////

// Header categories 
const categoryButton = document.querySelectorAll('.js-category-button');
categoryButton.forEach(catButton => {
  catButton.addEventListener('click', (event) => {
    const clickedCategory = event.target.dataset.category;

    showLanguagesForCategory(clickedCategory);
  });
});

// Languages Header
const languageButton = document.querySelectorAll('.js-language-button');
languageButton.forEach(langButton => {
  langButton.addEventListener('click', (event) => {
    const clickedLanguage = event.target.dataset.language
    
    showContentForLanguage(clickedLanguage);
  });
});

function showLanguagesForCategory(categoryName) {
  document.querySelectorAll('.language-button').forEach(button => {
    button.style.display = 'none';
  });

  document.querySelectorAll(`[data-category="${categoryName}"]`).forEach(button => {
    button.style.display = 'block';
  });
}

function showContentForLanguage(languageName) {
  document.querySelectorAll('.language-content').forEach(content => {
    content.style.display = 'none';
  });

  const selectedContent = document.querySelector(`[data-language="${languageName}"]`);
  if (selectedContent) {
    selectedContent.style.display = 'block';
  }
}

// If Frontend button is clicked, then only display the Frontend languages.
// Function to hide other button languages

// if HTML/CSS button is clicked, then only display the HTML/CSS content. Hide the other content.
// Function to hide other content 