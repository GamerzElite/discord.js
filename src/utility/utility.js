/* eslint-disable */
'use strict';

module.exports = class Utility {
  replaceInString(sourceString, replacements) {
    return sourceString.replace(
      /{\w+}/g,
      placeholder => replacements[placeholder.substring(1, placeholder.length - 1)] || placeholder,
    );
  }
};
