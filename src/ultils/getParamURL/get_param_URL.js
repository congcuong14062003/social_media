export function getURLParam() {
    const addressLocal = window.location.search;
    const urlParams = new URLSearchParams(addressLocal);

    const paramsObject = {};

    urlParams.forEach((value, key) => {
        paramsObject[key] = value;
    });

    return (paramsObject);
}
