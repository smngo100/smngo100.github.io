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

const resourceTypes = [
  {
    id: 'learning',
    name: 'Learning Platforms'
  },
  {
    id: 'tools',
    name: 'Tools & Frameworks'
  },
  {
    id: 'books',
    name: 'Books & Guides'
  },
  {
    id: 'practice',
    name: 'Practice & Projects'
  }
]

const languageResources = {
  'HTML/CSS':
  {
    learning: ['SuperSimpleDev'],
    tools: ['VS Code'],
    books: ['HTML CSS Book'],
    practice: ['HMTL CSS practice stuff']
  },
}

let headerHTML = '';
headerCategories.forEach(category => {
  headerHTML += `
    <button class="category-button js-category-button">
      ${category.name}
    </button>
  `;
});

let languagesHTML = '';
let resourceTitleLanguageHTML = '';
headerCategories.forEach(category => {
  const languagesArray = category.languages;
  languagesArray.forEach(lang => {
    languagesHTML += `
      <button class="language-button js-language-button">
        ${lang}
      </button>
    `;
    resourceTitleLanguageHTML = lang; // NEED TO DEBUG TO GET THE LANGUAGE NAME TO BE THE CURRENT LANGUAGE USER SELECTS
  });
});

let contentSections = ''; 
const resourceNames = resourceTypes.map(resource => resource.name);
resourceNames.forEach(name => {
  
  contentSections += `
    <div class="resourceTypesCard card">
      <h4 class="card-title">${name}</h4>
      <div class="js-card-content"></div>
    </div>
  `;
});


let contentPerCard = '';
Object.entries(languageResources).forEach(([language, resources]) => {
  Object.entries(resources).forEach(([resourceType, sources]) => {
    sources.forEach(source => {
      contentPerCard += `
        <a class="link">${source}</a>
      `;
    })
  });
});


// .addEventListener to language-button if the event === 'language' then display certain content



const devHubHTML = `
  <header>
    ${headerHTML}
  </header>

  <div class="languages-header">
    ${languagesHTML}
  </div>

  <section class="resource-content-container"> 
    <div class="resource-title-content">
        <h3 class="resource-title">${resourceTitleLanguageHTML} Resources</h3>
        <div class="resource-page-description">Curated resources for ${resourceTitleLanguageHTML}</div>
    </div>

    ${contentSections}
  </section>
`;

document.querySelector('.js-dev-hub').innerHTML = devHubHTML;
const cardContentElements = document.querySelector('.js-card-content');
cardContentElements.innerHTML = contentPerCard;

function changePageContent() {

}

// Event listeners for dynamically changing page content
const categoryButton = document.querySelector('.js-category-button');
categoryButton.addEventListener('click', )