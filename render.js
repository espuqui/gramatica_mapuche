import particles from "./js/data/nouns.json" assert { type: "json" };
import {parseExample} from "./js/src/parser.js";
window.addEventListener('load', function () {
  render("mew|inst")
  handleTooltips()
});

function handleTooltips() {
  document.addEventListener('click', function(event) {
    let elements = document.getElementsByClassName("tooltip")
    for (let elem of elements) {
      if (elem === event.target) {
        elem.children[0].style.visibility = 'visible'
      } else {
        elem.children[0].style.visibility = 'hidden'
      }
    }
  });
}


function render(wordId) {

  const particleTitle = document.getElementById("particleTitle")
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleExplanation = document.getElementById("particleExplanation")
  const particleUsesBox = document.getElementById("particleUsesBox")
  const exampleList = document.getElementById("exampleList")

  particleTitle.innerText = getWordTitle(wordId)
  particleTypeTitle.innerText = particles[wordId].title
  particleExplanation.innerText = particles[wordId].explanation
  particleUsesBox.innerHTML = ""
  exampleList.innerHTML = ""

  for (let usage of particles[wordId].usages) {
    particleUsesBox.innerHTML += renderUsage(usage)
  }

  for (let examples of particles[wordId].examples) {
    exampleList.innerHTML += renderMapu(examples[0], examples[1]) + "<br/>" + renderWinka(examples[2])
      + "<br /><br />"
  }

  // Necesito mapear wordId > Ejemplos
  // example = [mapu, spañol]


}

function renderUsage(usage) {
  let colonIndex = usage.indexOf(":")

  if (colonIndex === -1) {
    return usage + "<br/>"
  }

  let subTitle = usage.substring(0, colonIndex + 1)
  let details = usage.substring(colonIndex + 1)

  return renderWithSpan(subTitle, "particleOneWordUse")
  + renderWithSpan(details, "particleOneWordUseExplanation") + "<br/>"
}

function getWordTitle(wordId) {
  let wordTitle = getMainWord(wordId)
  if (particles[wordId].variations.length > 0) {
    for (let otherWord of particles[wordId].variations) {
      wordTitle += ", "
      wordTitle += otherWord
    }
  }
  return wordTitle
}

function getMainWord(wordId) {
  return wordId.split("|")[0]
}

function renderWithSpan(text, spanClass) {
  return `<span class="${spanClass}">${text}</span>`
}

function renderWithSpanOnClickAlert(text, spanClass) {
  return renderWithSpanOnClick(text, spanClass, "alert('" + text + "')")
}

function renderWithSpanOnClick(text, spanClass, code) {
  return `<span class="${spanClass}" onclick="${code}">${text}</span>`
}

function renderWithSpanOnClickTooltip(text, tooltipText, spanClass) {
    return `<span class="tooltip spanClass">${text}<span>${tooltipText}</span></span>`
}



function renderMapu(mapuche, grammar) {
  let html = '<img src="img/mapuche_flag.svg" width="20px" height="20px" alt="">'

  let exampleParts = parseExample(mapuche, grammar)
  html += " "

  for (let example of exampleParts) {
    if (example.includes("*")) {
      let wordParts = example.split("*")
      html += renderWithSpanOnClickTooltip(wordParts[0], wordParts[1], "normalWordExample")
    } else if (example.includes("|")) {
      let wordParts = example.split("|")

      html += renderWithSpan(wordParts[0], generateColorClassFromString(wordParts[1]))
    } else if (example === " ") {
      html += " "
    }
  }
 /* html += renderWithSpanOnClickTooltip("anel", "amenazar", "normalWordExample")
  html += renderWithSpan("tu", "particleExample1")
  html += renderWithSpan("fiñ", "particleExample2")
  html += " "
  html += renderWithSpanOnClickTooltip("kiñe", "amenazar", "normalWordExample")
  html += " "
  html += renderWithSpanOnClickTooltip("kuchillo", "amenazar", "normalWordExample")
  html += " "
  html += renderWithSpan("mew", "particleExample3 mainParticle")*/

  return html
}

function renderWinka(word) {
  let html = '<img src="img/spain_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  return html
}

function generateColorClassFromString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }

  let colorIndex = hash % 3
  return `particleExample${colorIndex}`
}

