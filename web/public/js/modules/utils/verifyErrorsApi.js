export default function verifyErrorsApi(data) {
    switch (true) {
        case data.error === "Unauthorized" || data.status == 401:
            window.location.href = "/?error=3"
            break;
        case data.error === "Forbidden" || data.status == 403:
            window.location.href = "/notaccess"
            break;
        default:
            break;
    }
}