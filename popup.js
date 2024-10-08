document.addEventListener('DOMContentLoaded', function() {
    const resultElement = document.getElementById('result');
    const detailsElement = document.getElementById('details');
    const loaderElement = document.getElementById('loader');

    function showLoader() {
        loaderElement.classList.remove('hidden');
        resultElement.classList.add('hidden');
        detailsElement.classList.add('hidden');
    }

    function hideLoader() {
        loaderElement.classList.add('hidden');
        resultElement.classList.remove('hidden');
        detailsElement.classList.remove('hidden');
    }

    function updateUI(response) {
        if (response.error) {
            resultElement.textContent = "Error: " + response.error;
            resultElement.classList.add('text-yellow-600');
            detailsElement.innerHTML = "<p class='italic'>Please refresh the page and try again.</p>";
        } else if (response.hasBootstrap) {
            resultElement.textContent = "Bootstrap detected!";
            resultElement.classList.add('text-green-600');
            resultElement.classList.remove('text-red-600');

            let detailsHTML = "<ul class='list-disc pl-5'>";
            if (response.cssDetected) detailsHTML += "<li>Bootstrap CSS detected</li>";
            if (response.jsDetected) detailsHTML += "<li>Bootstrap JavaScript detected</li>";
            if (response.classesDetected) detailsHTML += "<li>Bootstrap classes detected</li>";
            if (response.objectDetected) detailsHTML += "<li>Bootstrap JavaScript object detected</li>";
            detailsHTML += "</ul>";

            detailsElement.innerHTML = detailsHTML;
        } else {
            resultElement.textContent = "Bootstrap not detected.";
            resultElement.classList.add('text-red-600');
            resultElement.classList.remove('text-green-600');
            detailsElement.innerHTML = "<p class='italic'>No Bootstrap components were found on this page.</p>";
        }
    }

    showLoader();

    chrome.runtime.sendMessage({action: "detectBootstrap"}, function(response) {
        hideLoader();
        updateUI(response);
    });
});