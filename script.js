// script.js

var originalHTML, fontSize;
let inPreview = false;

function start() {
  addEventListeners();
  // get the value of 1em
  fontSize = parseFloat(getComputedStyle(document.querySelector('p')).fontSize);;
  tippy("#text-cta-button", {
    content: 'Link: <input id="text-cta-link" style="width:20em;">',
    trigger: 'click',
    onMount(instance) {
      setupLinkInput();
    },
    interactive: true,
    allowHTML: true
  });
}

function setupLinkInput() {
  let inputElement = document.getElementById("text-cta-link");
  let buttonCTA = document.getElementById("button-cta");
  inputElement.value = buttonCTA.href;
  inputElement.addEventListener('change', function (e) {
    buttonCTA.href = inputElement.value;
  });
}

function getHTML(saveType) {
  saveType = saveType || false;
  let newDocument = new DOMParser().parseFromString(document.body.innerHTML, 'text/html');
  // Format the main body text
  let textBody = newDocument.getElementById("text-body");
  textBody.setAttribute('contenteditable', false);
  textBody.style.height = 'auto';
  textBody.style.resize = 'none';
  textBody.style.resize = 'none';
  // Format the title
  let textTitle = newDocument.getElementById("text-title");
  textTitle.setAttribute('contenteditable', false);
  // Format the footer
  let textSubheading = newDocument.getElementById("text-subheading");
  textSubheading.setAttribute('contenteditable', false);
  let textCTA = newDocument.getElementById("text-cta");
  textCTA.setAttribute('contenteditable', false);
  // Enable the links
  let buttonCTA = newDocument.getElementById("text-cta-button");
  buttonCTA.setAttribute('contenteditable', false);
  if (saveType) {
    newDocument.getElementById("button-wrapper").remove();
    newDocument.querySelectorAll("script").remove();
  }
  return newDocument.body.innerHTML;
}

function togglePreviewEmail(e) {
  if (!inPreview) {
    originalHTML = document.body.innerHTML;
    let newHTML = getHTML();
    document.body.innerHTML = newHTML;
    document.getElementById("preview-button").innerText = "Edit";
    // Must add the event listeners back on
    addEventListeners();
    inPreview = true;
  } else {
    document.body.innerHTML = originalHTML;
    document.getElementById("preview-button").innerText = "Preview";
    addEventListeners();
    inPreview = false;
  }
}

function saveEmail() {
  let saveHTML = getHTML('save');
  var cssStyles = "";
  for(var i=1; i<document.styleSheets.length; i++) {
      var style = null;
      with (document.styleSheets[i]) {
          if (typeof cssRules != "undefined")
              style = cssRules;
          else if (typeof rules != "undefined")
              style = rules;
      }
      for(var item in style) {
          if(style[item].cssText != undefined)
              cssStyles += (style[item].cssText);
      }
  }
  style = '<style>' + cssStyles + '</style>';
  saveHTML = '<html><body>' + style + saveHTML + '</body></html>';
  downloadFile(saveHTML, "email.html", "text/html");
}

function addEventListeners() {
  document.getElementById("button-cta").addEventListener('click', function(e) {
    if (!inPreview) {
      e.preventDefault();
    }
  });
  document.getElementById("preview-button").addEventListener('click', togglePreviewEmail);
  document.getElementById("save-button").addEventListener('click', saveEmail);
  document.querySelectorAll(".text").forEach(function(el) {
    el.addEventListener("keydown", function(e) {
      if (e.keyCode === 8 && e.target.innerText.trim() === "") {
        e.preventDefault();
      }
    });
  });
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Pasted from Stackoverflow, courtesy of Kanchu
// Function to download data to a file
function downloadFile(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
