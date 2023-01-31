const request = require('request');
const fs = require('fs');

function sendRequest(urlParts) {
    return new Promise((resolve, reject) => {
        request.get('https://serverjars.com/api/' + urlParts, (error, response, body) => {
            if (error) {
                reject({title: 'Error Occurred', message: 'Try again later!'})
            } else {
                try {
                    body = JSON.parse(body);
                    if (body.status === 'error') {
                        reject(body.error);
                    } else {
                        resolve(body.response)
                    }
                } catch (e) {
                    reject({
                        title: 'JSON Parse Error Occurred',
                        message: 'Unable to parse JSON response from server'
                    })
                }

            }
            resolve();
        });
    });
}

/**
 * Fetch details on the latest jar for a type and category.
 * @param {*} type 
 * @param {*} category 
 * @returns 
 */
function fetchLatest(type,category) {
    return sendRequest(`fetchLatest/${type}/${category}`)
}

/**
 * Fetch a direct download link to a specific jar type with either the latest version or a specified one.
 * @param {*} type 
 * @param {*} version 
 * @param {*} output 
 * @returns 
 */
function downloadJar(type, version, output) {
    return new Promise((resolve) => {
        let file = fs.createWriteStream(output);
        resolve(request.get(`https://serverjars.com/api/fetchJar/${type}/${version}`).pipe(file));
    });
}

/**
 * Fetch details on the all the jars for a type and category.
 * @param {*} type 
 * @param {*} category 
 * @param {*} max 
 * @returns 
 */
function fetchAll(type,category,max = 5) {
    return sendRequest(`fetchAll/${type}/${category}/${max}`)
}

/**
 * Fetch a list of the possible jar types.
 * @returns 
 */
function fetchTypes() {
    return sendRequest('fetchTypes');

}

/**
 * Fetch a list of the possible jar's for a specific type.
 * @param {*} mainType 
 * @returns 
 */
function fetchSubTypes(mainType) {
    return sendRequest(`fetchTypes/${mainType}`)
}

/**
 * Fetch the details of a single jar.
 * @param {*} type 
 * @param {*} category 
 * @param {*} version 
 * @returns 
 */
function fetchDetails(type,category,version) {
    return sendRequest(`fetchDetails/${type}/${category}/${version}`);
}


module.exports = {fetchLatest, downloadJar, fetchAll, fetchTypes, fetchSubTypes, fetchDetails};
