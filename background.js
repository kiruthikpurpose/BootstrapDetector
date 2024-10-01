chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detectBootstrap") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        sendResponse({error: chrome.runtime.lastError.message});
        return;
      }
      
      const activeTab = tabs[0];
      if (!activeTab) {
        sendResponse({error: "No active tab found"});
        return;
      }

      chrome.scripting.executeScript(
        {
          target: {tabId: activeTab.id},
          function: detectBootstrap
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            sendResponse({error: chrome.runtime.lastError.message});
          } else {
            sendResponse(injectionResults[0].result);
          }
        }
      );
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

function detectBootstrap() {
  const bootstrapIndicators = [
    () => !!window.jQuery && !!window.jQuery.fn.modal,
    () => !!window.bootstrap,
    () => document.querySelector('link[href*="bootstrap"]') !== null,
    () => document.querySelector('script[src*="bootstrap"]') !== null,
    () => document.querySelectorAll('[class*="navbar-"], [class*="btn-"], [class*="modal-"], [class*="form-control"], [class*="card-"], [class*="container-"]').length > 0,
    () => getComputedStyle(document.body).getPropertyValue('--bs-body-font-family') !== ''
  ];

  return bootstrapIndicators.some(indicator => {
    try {
      return indicator();
    } catch (error) {
      console.error("Error in Bootstrap detection:", error);
      return false;
    }
  });
}