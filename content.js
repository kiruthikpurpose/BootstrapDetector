const frameworks = [
  { name: 'React', detect: () => !!window.React || !!document.querySelector('[data-reactroot], [data-reactid]') },
  { name: 'Angular', detect: () => !!window.angular || !!document.querySelector('[ng-app], [ng-controller], [ng-model]') },
  { name: 'Vue.js', detect: () => !!window.Vue || !!document.querySelector('[data-v-]') },
  { name: 'jQuery', detect: () => !!window.jQuery },
  { name: 'Bootstrap', detect: () => !!window.bootstrap || !!document.querySelector('[class*="navbar-"], [class*="btn-"], [class*="modal-"]') },
  { name: 'Ember.js', detect: () => !!window.Ember },
  { name: 'Backbone.js', detect: () => !!window.Backbone },
  { name: 'Svelte', detect: () => !!document.querySelector('[class*="svelte-"]') },
  { name: 'Preact', detect: () => !!window.preact },
  { name: 'Next.js', detect: () => !!window.__NEXT_DATA__ },
  { name: 'Gatsby', detect: () => !!window.___gatsby },
  { name: 'Nuxt.js', detect: () => !!window.__NUXT__ },
  { name: 'Meteor', detect: () => !!window.Meteor },
  { name: 'Express.js', detect: () => document.querySelector('meta[name="generator"][content*="Express"]') !== null },
  { name: 'Laravel', detect: () => document.querySelector('meta[name="csrf-token"]') !== null },
  { name: 'Django', detect: () => document.querySelector('meta[name="robots"][content*="DJANGO"]') !== null },
  { name: 'Ruby on Rails', detect: () => document.querySelector('meta[name="csrf-param"]') !== null },
  { name: 'ASP.NET', detect: () => document.querySelector('input[name="__VIEWSTATE"]') !== null },
  { name: 'Polymer', detect: () => !!window.Polymer },
  { name: 'Lit', detect: () => !!window.litElementVersions },
  { name: 'Aurelia', detect: () => !!window.aurelia },
  { name: 'Knockout.js', detect: () => !!window.ko },
  { name: 'Mithril', detect: () => !!window.m && typeof window.m === 'function' },
  { name: 'Ext JS', detect: () => !!window.Ext },
  { name: 'Lodash', detect: () => !!window._ && typeof window._ === 'function' },
  { name: 'Moment.js', detect: () => !!window.moment },
  { name: 'D3.js', detect: () => !!window.d3 },
  { name: 'Three.js', detect: () => !!window.THREE },
  { name: 'Chart.js', detect: () => !!window.Chart },
  { name: 'Axios', detect: () => !!window.axios }
];

function detectFrameworks() {
  console.log('Detecting frameworks...');
  const detectedFrameworks = frameworks.filter(fw => {
    try {
      return fw.detect();
    } catch (error) {
      console.error(`Error detecting ${fw.name}:`, error);
      return false;
    }
  });
  console.log('Detected frameworks:', detectedFrameworks.map(fw => fw.name));
  return detectedFrameworks.map(fw => fw.name);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detectFramework") {
    console.log('Received detectFramework message');
    const detectedFrameworks = detectFrameworks();
    console.log('Sending response with detected frameworks');
    chrome.runtime.sendMessage({ action: "frameworksDetected", frameworks: detectedFrameworks });
    sendResponse({success: true}); // Acknowledge receipt of the message
  }
  return true; // Indicates that the response is sent asynchronously
});

console.log('Content script loaded');