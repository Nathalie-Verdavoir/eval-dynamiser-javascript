/*
 * Nathalie Verdavoir 
 * v20211110
 */
// Script to remove the ads content of the free server
// Ads are injected at the end of the body, so it's the last div with a in it
const removeAd = () => {
    //select the a with href of the server
    const ad = document.querySelector('a[href*="freewebhostingarea"]');
    //and remove the parent div
    ad.parentNode.remove();
}

//launch the function after loading
document.addEventListener("DOMContentLoaded", removeAd);