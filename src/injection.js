(async () => {
    let html = await fetch(chrome.runtime.getURL('/files/index.html')).then(r => r.text());
    document.documentElement.innerHTML = html;

    let [interception_js, vendor_js, bundle_js, bundle_css ,configuration_json] =
        await Promise.allSettled([
            fetch(chrome.runtime.getURL("/src/interception.js")).then((r) =>
                r.text(),
            ),
            fetch(chrome.runtime.getURL("/files/vendor.js")).then((r) =>
                r.text(),
            ),
            fetch(chrome.runtime.getURL("/files/bundle.js")).then((r) =>
                r.text(),
            ),
            fetch(chrome.runtime.getURL("/files/bundle.css")).then((r) =>
                r.text(),
            ),
            fetch(chrome.runtime.getURL("/files/configuration.json")).then((r) =>
                r.text(),
            ),
        ]);
    if (!localStorage.getItem("OTDalwaysUseLocalFiles")) {
        const [
            remote_interception_js,
            remote_vendor_js,
            remote_bundle_js,
            remote_bundle_css,
        ] = await Promise.allSettled([
            fetch(
                "https://raw.githubusercontent.com/dimdenGD/OldTweetDeck/main/src/interception.js",
            ).then((r) => r.text()),
            fetch(
                "https://raw.githubusercontent.com/dimdenGD/OldTweetDeck/main/files/vendor.js",
            ).then((r) => r.text()),
            fetch(
                "https://raw.githubusercontent.com/dimdenGD/OldTweetDeck/main/files/bundle.js",
            ).then((r) => r.text()),
            fetch(
                "https://raw.githubusercontent.com/dimdenGD/OldTweetDeck/main/files/bundle.css",
            ).then((r) => r.text()),
        ]);

        if (
            remote_interception_js.status === "fulfilled" &&
            remote_interception_js.value.length > 30
        ) {
            interception_js = remote_interception_js;
            console.log("Using remote interception.js");
        }
        if (
            remote_vendor_js.status === "fulfilled" &&
            remote_vendor_js.value.length > 30
        ) {
            vendor_js = remote_vendor_js;
            console.log("Using remote vendor.js");
        }
        if (
            remote_bundle_js.status === "fulfilled" &&
            remote_bundle_js.value.length > 30
        ) {
            bundle_js = remote_bundle_js;
            console.log("Using remote bundle.js");
        }
        if (
            remote_bundle_css.status === "fulfilled" &&
            remote_bundle_css.value.length > 30
        ) {
            bundle_css = remote_bundle_css;
            console.log("Using remote bundle.css");
        }
    }

    let interception_js_script = document.createElement("script");
    interception_js_script.innerHTML = interception_js.value;
    document.head.appendChild(interception_js_script);

    let vendor_js_script = document.createElement("script");
    vendor_js_script.innerHTML = vendor_js.value;
    document.head.appendChild(vendor_js_script);

    let bundle_js_script = document.createElement("script");
    bundle_js_script.innerHTML = bundle_js.value;
    document.head.appendChild(bundle_js_script);

    let bundle_css_style = document.createElement("style");
    bundle_css_style.innerHTML = bundle_css.value;
    document.head.appendChild(bundle_css_style);

    let configuration_json_script = document.createElement("script");
    configuration_json_script.innerHTML = `window.configuration = ${configuration_json.value}`;
    document.head.appendChild(configuration_json_script);

    let int = setTimeout(function() {
        let badBody = document.querySelector('body:not(#injected-body)');
        if (badBody) {
            let badHead = document.querySelector('head:not(#injected-head)');
            clearInterval(int);
            if(badHead) badHead.remove();
            badBody.remove(); 
        }
    }, 200);
    setTimeout(() => clearInterval(int), 10000);
})();