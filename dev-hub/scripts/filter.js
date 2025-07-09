export function showLanguagesForCategory(categoryName) {
  document.querySelectorAll('.js-language-button').forEach(langauge => {
    langauge.style.display = 'none';
  });

  document.querySelectorAll(`[data-category="${categoryName}"]`).forEach(button => {
    button.style.display = 'block';
  });
}

export function showContentForLanguages(languageName) {
  document.querySelectorAll('.js-resource-content-container').forEach(content => {
    content.style.display = 'none';
  });

  const selectedContent = document.querySelector(`[data-language-content="${languageName}"]`);
  if (selectedContent) {
    selectedContent.style.display = 'block';
  }
}