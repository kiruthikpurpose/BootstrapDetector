chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detectBootstrap") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: detectBootstrap
        }, (results) => {
          if (chrome.runtime.lastError) {
            sendResponse({ error: chrome.runtime.lastError.message });
          } else if (results && results[0]) {
            sendResponse(results[0].result);
          } else {
            sendResponse({ error: "Unknown error occurred" });
          }
        });
      });
      return true; // Asynchronous response
    }
  });
  
  function detectBootstrap() {
    let result = {
      hasBootstrap: false,
      cssDetected: false,
      jsDetected: false,
      classesDetected: false,
      objectDetected: false
    };
  
    // Check for Bootstrap CSS
    const stylesheets = document.styleSheets;
    for (let i = 0; i < stylesheets.length; i++) {
      try {
        let href = stylesheets[i].href;
        if (href && href.includes('bootstrap')) {
          result.cssDetected = true;
          result.hasBootstrap = true;
          break;
        }
      } catch (e) {
        console.log(e);
      }
    }
  
    // Check for Bootstrap JavaScript
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      let src = scripts[i].src;
      if (src && src.includes('bootstrap')) {
        result.jsDetected = true;
        result.hasBootstrap = true;
        break;
      }
    }
  
    // Check for common Bootstrap classes
    const bootstrapClasses = [
      'container', 'row', 'col-', 'btn', 'form-control', 'navbar', 'card',
      'alert', 'modal', 'carousel', 'dropdown', 'collapse', 'table'
    ];
  
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const classList = elements[i].classList;
      for (let j = 0; j < bootstrapClasses.length; j++) {
        if (classList.toString().includes(bootstrapClasses[j])) {
          result.classesDetected = true;
          result.hasBootstrap = true;
          break;
        }
      }
      if (result.classesDetected) break;
    }
  
    // Check for Bootstrap's JavaScript objects
    if (typeof window.bootstrap !== 'undefined' || 
        (typeof window.$ !== 'undefined' && typeof window.$.fn.modal !== 'undefined')) {
      result.objectDetected = true;
      result.hasBootstrap = true;
    }
  
    return result;
  }