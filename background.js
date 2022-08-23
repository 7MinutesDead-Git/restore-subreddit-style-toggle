// Since injected functions with chrome
// content scripts are a copy, not a reference.
// Trying to access any functions or variables out of this scope wouldn't work.
// So everything will go inside restoreSubredditStyleToggle().
async function restoreSubredditStyleToggle() {
    // --------------------------------------------------------------
    let toggleForm = null
    const pollrate = 100
    let waited = 0

    // --------------------------------------------------------------
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async function getFormToggle() {
        console.log('🐠 Waiting for annoying modal... 🐠')
        while (!toggleForm) {
            toggleForm = document.querySelector('.res-sr-style-toggle')
            await wait(pollrate)
            waited += pollrate
        }
    }
    function unhideFormToggle() {
        // Adjusting transform: translate for any amount seems to bring it back to visibility.
        toggleForm.style.transform = 'translateY(8px)'
        console.log(`🐠 Found toggle form after ${waited}ms 🐠`)
    }
    // ------------------------------------------------------------------------
    await getFormToggle()
    unhideFormToggle()
    console.log(`🐠 All done after ${waited}ms 🐠`)
}

// -------------------------------------------------------------
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        console.log(`tab: ${tab.id}`, tab)

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: restoreSubredditStyleToggle,
            args: [],
        });
    }
})