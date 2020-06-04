 let isValidQuestion = (questionData) => {
  let isValid = true;
  if (
    questionData.question &&
    questionData.rightOptions &&
    questionData.rightOptions.length &&
    questionData.options &&
    questionData.options.length == 4
  ) {  
    questionData.rightOptions.forEach((rightOption) => {
      if (!questionData.options.includes(rightOption)) {
        isValid = false;
      }
    });
  } else {
    isValid = false;
  }
  return isValid;
};

module.exports =  {isValidQuestion} ; 