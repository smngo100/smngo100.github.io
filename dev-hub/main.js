import { headerCategories, resourceTypeLabels, languageResources } from "./scripts/data.js";
import { showLanguagesForCategory, showContentForLanguages } from "./scripts/filter.js";

let headerHTML = '';
let languagesHTML = '';

headerCategories.forEach(category => {
  headerHTML += `
    <button class="category-button js-category-button" data-category="${category.name}">
      ${category.name}
    </button>
  `;

  const languagesArray = category.languages;
  languagesArray.forEach(language => {
    languagesHTML += `
    <button class="language-button js-language-button" data-category="${category.name}" data-language="${language}">
      ${language}
    </button>
  `;
  })
});

let cardContentHTML = '';
let displayName = '';
Object.entries(languageResources).forEach(([languageName, resources]) => {
  cardContentHTML += `
    <section class="resource-content-container js-resource-content-container" data-language-content="${languageName}">
      <h3 class="resource-title">${languageName} Resources</h3>
  `;

  Object.entries(resources).forEach(([resourceType, resource]) => {
    displayName = resourceTypeLabels[resourceType];
    cardContentHTML += `
      <div class="card">
        <div class="title-and-link-container">
          <h4 class="card-title">${displayName}</h4>
    `;
    resource.forEach(source => {
      cardContentHTML += `
        <a class="link" href="${source}" target="_blank">${source}</a>
        `;
    });

    cardContentHTML += `
        </div>
      </div>
    `;
  });

  cardContentHTML += `
    </section>`;
});

////////////////////////////////////////////////////////////////////////////////

const devHubHTML = `
  <header>
    ${headerHTML}
  </header>

  <div class="languages-header">
    ${languagesHTML}
  </div>

  ${cardContentHTML}
`;

document.querySelector('.js-dev-hub').innerHTML = devHubHTML;


// Event listeners

const categoryButton = document.querySelectorAll('.js-category-button');
categoryButton.forEach(catButton => {
  catButton.addEventListener('click', (event) => {
    const clickedCategory = event.target.dataset.category;

    showLanguagesForCategory(clickedCategory);
  })
});

const languageButton = document.querySelectorAll('.js-language-button');
languageButton.forEach(langButton => {
  langButton.addEventListener('click', (event) => {
    const clickedLanguage = event.target.dataset.language;

    showContentForLanguages(clickedLanguage);
  })
});

// Default
showLanguagesForCategory('Frontend');