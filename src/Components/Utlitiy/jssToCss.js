const jssToCss = javascript => {
  var str = JSON.stringify(javascript)
  str = str.replaceAll('"', "")
  str = str.replaceAll(",", ";")
  var result = ""
  var flag = 0
  for (var i = 0; i < str.length; i++) {
    var code = str[i].charCodeAt()
    if (str[i] === ":") flag = 1
    if (flag !== 1 && code >= 65 && code <= 90) {
      result += "-" + str[i].toLowerCase()
    } else {
      result += str[i]
    }
    if (str[i] === ";") {
      flag = 0
    }
  }
  return result
}

const cssToJs = css => {
  var str = css
  str = str.replaceAll(":", ":'")
  str = str.replaceAll(";", "';")

  str = str.replaceAll(";", ",")

  var result = ""
  for (var i = 0; i < str.length; i++) {
    if (i !== 0) {
      if (str[i] === "-") {
      } else result += str[i - 1] === "-" ? str[i].toUpperCase() : str[i]
    } else result += str[i]
  }

  return result
}

const converter = { jssToCss, cssToJs }
export default converter
