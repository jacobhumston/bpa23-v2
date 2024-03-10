// This script is executed on ALL pages.
// Responsible for simple such as modifying the title.

/**
 * Change the documents title. (Append the name.)
 * @param {Document} document
 * @param {string} title
 * @param {string} name
 */
function changeTitle(document, title, name) {
    document.title = `${title} | ${name}`;
}

/**
 * Wait for an element to be present/loaded via it's ID.
 * @param {string} id ID of the element to wait for.
 * @returns {Promise.<void>}
 */
function waitForElement(id) {
    return new Promise(function (resolve) {
        const interval = setInterval(function () {
            if (document.getElementById(id) !== null) {
                clearInterval(interval);
                resolve();
            }
        });
    });
}

/**
 * Update the menu bar to the correct state.
 */
function updateMenuBar() {
    {
        const menubar = document.getElementById('menuBar');
        const anchors = menubar.getElementsByClassName('menuBarNormal');
        for (let i = 0; i !== anchors.length; i++) {
            const item = anchors.item(i);
            if (item.href.replace('?l', '') === window.location.href.replace('?l', '')) {
                item.classList.add('menuBarNormalCurrent');
            }
        }
    }

    {
        const menubar = document.getElementById('menuBarMobile');
        const anchors = menubar.getElementsByClassName('menuBarNormal');
        for (let i = 0; i !== anchors.length; i++) {
            const item = anchors.item(i);
            if (item.href.replace('?l', '') === window.location.href.replace('?l', '')) {
                item.classList.add('menuBarNormalCurrent');
            }
        }
    }
}

/**
 * Insert loading divider.
 */
function insertLoadingDivider(tween, tweenCallback) {
    const divider = document.createElement('div');
    divider.id = 'loadingDiv';
    const img = document.createElement('img');
    img.src = '/assets/images/logo.png';
    const details = document.createElement('p');
    details.innerText = 'Loading...';
    if (tween) img.classList.add('no-anim');
    divider.insertAdjacentElement('afterbegin', details);
    divider.insertAdjacentElement('afterbegin', img);
    document.documentElement.insertAdjacentElement('beforeEnd', divider);
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    if (tween === true) {
        divider.style.opacity = 0;
        const interval = setInterval(() => {
            divider.style.opacity = parseFloat(divider.style.opacity) + 0.005;
            if (parseFloat(divider.style.opacity) >= 1) {
                clearInterval(interval);
                if (tweenCallback) tweenCallback();
            }
        }, 2);
    }
}

/**
 * Hide loading divider.
 */
function hideLoadingDivider(callback) {
    document.body.removeAttribute('style');
    const divider = document.getElementById('loadingDiv');
    divider.style.opacity = 1;
    const interval = setInterval(() => {
        divider.style.opacity = parseFloat(divider.style.opacity) - 0.005;
        if (parseFloat(divider.style.opacity) <= 0) {
            clearInterval(interval);
            divider.remove();
            document.documentElement.style.overflowY = 'auto';
            document.documentElement.style.overflowX = 'auto';
            if (callback) {
                callback();
            }
        }
    }, 0.5);
}

/**
 * Function to connect the loading menu to all anchor elements.
 */
function attachLoadingAnimation() {
    const links = document.getElementsByTagName('a');
    for (const link of links) {
        if (!link.href) continue;
        if (new URL(link.href).pathname.includes('.')) continue;
        if (new URL(link).origin !== document.location.origin) continue;
        const destination = link.href;
        link.dataset.href = destination;
        link.href = 'javascript:;';
        link.addEventListener('click', function (event) {
            if (event.ctrlKey) {
                window.open(destination);
            } else {
                insertLoadingDivider(true, function () {
                    document.location.href = `${destination}?l`;
                    setTimeout(() => {
                        hideLoadingDivider();
                    }, 10 * 1000);
                });
            }
        });
    }
}

const shouldDisplayLoadingScreen = new URLSearchParams(window.location.search).has('l');

if (shouldDisplayLoadingScreen) {
    insertLoadingDivider();
} else {
    document.body.removeAttribute('style');
}

changeTitle(document, document.title, 'Game Day Grill');
libs.include.includeBody(document, '/includes/menu-bar.html', 'start');
libs.include.includeBody(document, '/includes/footer.html', 'end');
libs.include.includeHeadCSS(document, '/css/menu-bar.css', 'end');
libs.include.includeHeadCSS(document, '/css/footer.css', 'end');
waitForElement('menuBar').then(updateMenuBar);

window.addEventListener('load', async function () {
    if (shouldDisplayLoadingScreen) {
        await wait(500);
        hideLoadingDivider(attachLoadingAnimation);
    } else {
        attachLoadingAnimation();
    }
});
