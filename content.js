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

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "detectBootstrap") {
        sendResponse(detectBootstrap());
    }
});

// Inject a script to check for dynamically loaded Bootstrap
function injectScript() {
    const script = document.createElement('script');
    script.textContent = `
        (function() {
            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function() {
                const result = originalAppendChild.apply(this, arguments);
                if (arguments[0].tagName === 'SCRIPT' || arguments[0].tagName === 'LINK') {
                    window.postMessage({ type: "BOOTSTRAP_DETECTOR_DYNAMIC_LOAD" }, "*");
                }
                return result;
            };
        })();
    `;
    document.documentElement.appendChild(script);
}

injectScript();

// Listen for dynamic loads
window.addEventListener("message", function(event) {
    if (event.data.type === "BOOTSTRAP_DETECTOR_DYNAMIC_LOAD") {
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "checkAgain"});
        }, 1000); // Wait a second for the resource to load
    }
}, false);