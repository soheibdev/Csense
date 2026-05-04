const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'query' ? req.query : req.body;
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (source === 'query') {
    req.query = value;
  } else {
    req.body = value;
  }

  next();
};

module.exports = { validate };
