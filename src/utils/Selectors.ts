export const Selectors = {
  // Authentication
  LOGIN_USER_TYPE: '#user_type',
  LOGIN_USERNAME: '#username',
  LOGIN_PASSWORD: '#password',
  LOGIN_SUBMIT: 'button[type="submit"]',
  
  // EC Intro Page (Gateway to tgigrs)
  INTRO_SUBMIT_BUTTON: 'form[action*="tgigrs"] button[type="submit"], button:has-text("Submit")',

  // EC Search Selection
  SEARCH_CRITERIA_DOCUMENT: 'input[name="docSel"][value="1"]',
  SEARCH_CRITERIA_PROPERTY: 'input[name="docSel"][value="0"]',

  // EC Search by Document Number
  DOC_NO_INPUT: '#doct',
  DOC_YEAR_INPUT: '#regyear',
  DOC_SRO_INPUT: '#sroVal',
  
  // EC Search by Property (best guess until HTML is provided for this tab)
  DISTRICT_DROPDOWN: '#district',
  SRO_DROPDOWN: '#sro',
  VILLAGE_DROPDOWN: '#village',
  SURVEY_NO_INPUT: '#surveyNo',
  PLOT_NO_INPUT: '#plotNo',
  FROM_YEAR_INPUT: '#fromYear',
  TO_YEAR_INPUT: '#toYear',

  // Common
  SUBMIT_BUTTON: 'button[type="submit"], #submit',
  DOWNLOAD_BUTTON: 'button:has-text("Download"), a:has-text("Download")',
};
