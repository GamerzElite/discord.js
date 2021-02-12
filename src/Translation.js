/* eslint-disable */
'use strict';
const fs = require('fs');
module.exports = class Translation {
  constructor() {
    this.phrases = [];
  }
  loadFromFile(path) {
    this.phrases = JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  loadFromArray(array) {
    this.phrases = array;
  }
  getByName(language, name) {
    const phrase = this.phrases.find(
      trans =>
        trans.name.toLowerCase() === name.toLowerCase() && trans.language.toLowerCase() === (language? language:'en').toLowerCase(),
    );

    if (!phrase) {
      if ((language?language:'en').toLowerCase() === 'en') {
        throw new Error(`Translation missing for ${name}`);
      }

      return this.getByName('en', name);
    }



    return phrase.value;
  }

  getAllByName(name) {
    const translations = this.phrases.filter(translation => translation.name.toLowerCase() === name.toLowerCase());

    if (translations.length === 0) {
      throw new Error(`Translation missing for ${name}`);
    }

    return translations;
  }
};
