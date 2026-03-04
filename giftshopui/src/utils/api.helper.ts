export const handleApiError = (error: any): string => {
    // Nếu lỗi có response từ server trả về (Backend trả về ResponseObject)
    if (error.response && error.response.data) {
        // Lấy câu thông báo từ API của bạn (nằm trong trường message)
        const serverMessage = error.response.data.message;
        if (serverMessage) {
            return serverMessage;
        }
    }

    // Nếu lỗi do mất kết nối mạng hoặc server sập
    if (error.request) {
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.';
    }

    // Các lỗi khác trong quá trình setup request
    return error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
};