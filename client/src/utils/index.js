export const readFileAsBase64 = (file) => {
    return new Promise((resolve,reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => resolve(e.target.error)
    })
}
export const isValidURL = (string)  => {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};