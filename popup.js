document.addEventListener('DOMContentLoaded', function() {
  const resultElement = document.getElementById('result');

  function showResult(isBootstrap) {
    resultElement.innerHTML = isBootstrap
      ? '<p class="success">Yes, Bootstrap detected! 🎉</p>'
      : '<p class="failure">No, Bootstrap not found.</p>';
  }

  function showError(message) {
    resultElement.innerHTML = `<p class="failure">Error: ${message}</p>`;
  }

  chrome.runtime.sendMessage({action: "detectBootstrap"}, function(response) {
    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
    } else if (response.error) {
      showError(response.error);
    } else {
      showResult(response);
    }
  });
});