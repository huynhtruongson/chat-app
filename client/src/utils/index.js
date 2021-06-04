export const readFileAsBase64 = (file) => {
    return new Promise((resolve,reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => resolve(e.target.error)
    })
}