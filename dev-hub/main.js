import { headerCategories, resourceTypeLabels, languageResources, misc } from "./scripts/data.js";
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

// Misc. page (different layout than the other cards)
Object.entries(misc).forEach(([miscName, miscResources]) => {
  cardContentHTML += `
    <section class="resource-content-container js-resource-content-container" data-language-content="${miscName}">
      <h3 class="resource-title">${miscName}</h3>
      <div class="card">
        <div class="title-and-link-container">
  `;
  
  miscResources.forEach(source => {
    cardContentHTML += `
      <a class="link" href="${source}" target="_blank">${source}</a>
    `;
  });

  cardContentHTML += `
          </div>
        </div>
      </section>
    `;
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


//////////////////////////////////////// Event listeners ////////////////////////////////////////
let categoryButton = document.querySelectorAll('.js-category-button');
categoryButton.forEach(catButton => {
  catButton.addEventListener('click', (event) => {
    const clickedCategory = event.target.dataset.category;

    showLanguagesForCategory(clickedCategory);

    // Set 1st language of each category as default page 
    const categoryObject = headerCategories.find(category => category.name === clickedCategory);
    const firstLang = categoryObject.languages[0];
    showContentForLanguages(firstLang);

    // Shows what category the user selected
    categoryButton.forEach(btn => btn.classList.remove('category-button-active'));
    catButton.classList.toggle('category-button-active');
  })
});

const languageButton = document.querySelectorAll('.js-language-button');
languageButton.forEach(langButton => {
  langButton.addEventListener('click', (event) => {
    const clickedLanguage = event.target.dataset.language;

    showContentForLanguages(clickedLanguage);

    // Shows what language the user selected
    languageButton.forEach(btn => btn.classList.remove('language-button-active'));
    langButton.classList.toggle('language-button-active');
  })
});


// When user clicks reloads page, the Frontend HTML/CSS should be the default page content and default language in the languages header
showLanguagesForCategory('Frontend');


/*
function activeOnDefault(defaultCategory) {
  const firstCategory = Array.from(categoryButton).find(button => button.dataset.category === defaultCategory);
  firstCategory.classList.toggle('category-button-active');
}

activeOnDefault('Frontend');
*/
