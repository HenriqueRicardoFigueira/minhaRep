color = (field, regex) => {
  var newColor = null
  if (regex.test(String(field).toLowerCase())) {
    newColor = '#e6e6e6'
  } else {
    newColor = '#ff0000'
  }

  return newColor
}

function nameColor(name) {
  newColor = name.length > 32 ? '#ff0000' : color(name, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)

  this.setState({
    borderColorName: newColor,
  })

  return newColor == '#e6e6e6'
}

// utilizando um regex, verifica o email
function emailColor(email) {

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var newColor = null
  if (re.test(String(email).toLowerCase())) {
    newColor = '#e6e6e6'
  } else {
    newColor = '#ff0000'
  }

  this.setState({
    borderColorEmail: newColor
  })

  return newColor
}

// apenas verifica se a variável está sem valor
// se estiver, altera a cor da borda do input
function passwordColor(password) {
  var newColor = null
  if (password.length > 4) {
    newColor = '#e6e6e6'
  } else {
    newColor = '#ff0000'
  }

  this.setState({
    borderColorPassword: newColor
  })

  return newColor
}

function ageColor(age) {
  newColor = color(age, /^[0-9][0-9]$/)

  this.setState({
    borderColorAge: newColor
  })

  return newColor == '#e6e6e6'
}

function bioColor(bio) {
  newColor = color(bio, /^(.|\s)*[a-zA-Z]+(.|\s)*$/)

  this.setState({
    borderColorBio: newColor
  })

  return newColor == '#e6e6e6'
}

function numberColor(number) {
  newColor = color(number, /^[0-9][0-9]$/)

  this.setState({
    borderColorNumber: newColor
  })

  return newColor == '#e6e6e6'
}

module.exports = { nameColor, emailColor, passwordColor, ageColor, bioColor, numberColor };