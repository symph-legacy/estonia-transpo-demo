const isObject = val => {
    return typeof val === 'object' && val !== null;
};

export const toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

export const isEmptyObject = obj => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

export const truncate = function (str, n, useWordBoundary=true) {
    if (str.length <= n) { return str; }
    var subString = str.substr(0, n - 1);
    return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(' '))
        : subString) + "...";
}

export const classnames = (...args) => {
    const classes = [];
    args.forEach(arg => {
        if (typeof arg === 'string') {
            classes.push(arg);
        } else if (isObject(arg)) {
            Object.keys(arg).forEach(key => {
                if (arg[key]) {
                    classes.push(key);
                }
            });
        } else {
            throw new Error(
                '`classnames` only accepts string or object as arguments'
            );
        }
    });

    return classes.join(' ');
};