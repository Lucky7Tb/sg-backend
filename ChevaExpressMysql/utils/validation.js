const validate = require('validate.js');

exports.bookValidation = (attribute) => {
  let constraint = {
    title: {
      presence: { allowEmpty: false },
    },
    author: {
      presence: { allowEmpty: false },
    },
    isbn: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    cover: {
      presence: { allowEmpty: false },
			url: true
    },
  };

	return validate(attribute, constraint, {
		format: 'flat'
	});
};

exports.authorValidation = (attribute) => {
  let constraint = {
    username: {
      presence: { allowEmpty: false },
    },
    password: {
      presence: { allowEmpty: false },
    },
  };

  return validate(attribute, constraint, {
    format: 'flat',
  });
};
