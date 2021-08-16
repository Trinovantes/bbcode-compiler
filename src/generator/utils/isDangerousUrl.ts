const dangerousUriRe = /^(vbscript|javascript|file|data):/
const safeDataUriRe = /^data:image\/(gif|png|jpeg|webp);/

export function isDangerousUrl(url: string): boolean {
    const normalizedUrl = url.trim().toLowerCase()

    if (!dangerousUriRe.test(normalizedUrl)) {
        return false
    }

    // Only a subset of data uris are considered safe
    if (safeDataUriRe.test(normalizedUrl)) {
        return false
    }

    return true
}
