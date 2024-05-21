import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/lt'; 

import en from './locales/en/translation.json';
import lt from './locales/lt/translation.json';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: en,
      },
      lt: {
        translation: lt,
      },
    },
    lng: 'lt', // numatytoji kalba
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

i18n.on('languageChanged', (lng) => {
  moment.locale(lng);
});

export default i18n;
