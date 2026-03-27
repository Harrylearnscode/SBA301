# Giftshop Web App - Project Analysis

## 1. Tổng quan dự án (Project Overview)
Hệ thống là một ứng dụng web bán quà Tết toàn diện gồm Backend (Spring Boot) và Frontend (React/Vite). Cốt lõi của hệ thống hỗ trợ hai luồng bán hàng chính:
*   **B2C (Bán lẻ cho khách hàng cá nhân):** Luồng thương mại điện tử tiêu chuẩn (Thêm vào giỏ hàng -> Đặt hàng -> Thanh toán).
*   **B2B (Bán sỉ cho doanh nghiệp):** Luồng báo giá (Quotation-based workflow) có sự thương lượng giá cả giữa khách hàng và Admin/Sale.

### Công nghệ sử dụng (Tech Stack)
*   **Backend:** Java 21, Spring Boot 3.4.0, Spring Security (JWT), Spring Data JPA, Hibernate, SQL Server, MapStruct, AWS S3 / Cloudflare R2 (Storage).
*   **Frontend:** React (TypeScript), Vite, Axios để gọi API, quản lý trạng thái và UI components phân chia rõ theo Customer và Seller.

---

## 2. Cấu trúc thư mục (Directory Structure)

### Backend (`/giftshop/src/main/java/com/sba301/giftshop`)
*   `controller/`: Chứa các REST APIs giao tiếp với Frontend.
*   `service/`: Chứa logic nghiệp vụ cốt lõi (xử lý đơn hàng B2C, tính toán báo giá B2B).
*   `model/`: Gồm `entity` (Mapping với DB) và `dto` (Data Transfer Objects cho Request/Response).
*   `repository/`: Tầng truy xuất dữ liệu database (JPA Repositories).
*   `security/` & `filter/`: Cấu hình xác thực JWT, phân quyền truy cập.
*   `configs/`: Cấu hình hệ thống chung (Security, CORS, Swagger).

### Frontend (`/giftshopui/src`)
*   `pages/Customer/`: Các giao diện dành cho khách mua hàng (B2C & trang yêu cầu báo giá B2B).
*   `pages/Seller/`: Bảng điều khiển (Dashboard) dành cho Admin/Seller để quản lý sản phẩm, đơn hàng, và báo giá.
*   `components/`: Các UI component dùng chung, layout, auth modals.
*   `api/endpoints.ts`: Nơi định nghĩa và tập trung toàn bộ các URL/APIs gọi xuống Backend.

---

## 3. Các luồng nghiệp vụ cốt lõi (Core Business Workflows)

### 3.1. Luồng B2C (Customer Order Flow)
Quy trình mua hàng tiêu chuẩn cho người dùng thông thường.
1.  **Giỏ hàng (Cart):** Người dùng thêm các phân loại sản phẩm (`ProductItem`) vào giỏ hàng (`Cart`).
2.  **Đặt hàng (Checkout):** Người dùng gọi `POST /api/orders/checkout` để chuyển giỏ hàng thành Đơn hàng (`Order`) với các chi tiết (`OrderDetails`).
3.  **Theo dõi:** Khách hàng xem lịch sử đơn qua `GET /api/orders/my-orders`.
4.  **Xử lý đơn (Fulfillment):** Admin xem đơn (`GET /api/orders/admin`) và cập nhật trạng thái đơn/thanh toán (`PUT /api/orders/admin/{id}/status`).

### 3.2. Luồng B2B (Corporate Quotations Flow)
Quy trình đặc biệt dành cho khách hàng doanh nghiệp, áp dụng chính sách chiết khấu (`Policy`) dựa trên số lượng.
1.  **Yêu cầu báo giá (Request Quote):** Khách hàng doanh nghiệp gửi yêu cầu `POST /api/quotes` với danh sách số lượng sản phẩm.
2.  **Admin định giá (Provide Pricing):** Admin nhận yêu cầu báo giá, tính toán và gửi lại giá chốt cho khách thông qua `POST /api/quotes/admin/{id}/provide-pricing`.
3.  **Phản hồi từ Khách:** Khách hàng xem giá do Admin đưa ra và quyết định Chấp nhận/Từ chối qua `POST /api/quotes/{id}/reply`.
4.  **Chốt đơn:** Nếu đồng ý, báo giá sẽ chuyển hóa thành đơn hàng thực tế để giao dịch.

---

## 4. Tài liệu API Backend Đã Tinh Chỉnh (Refined API Endpoints)

Dưới đây là danh sách phân tích các API chính hệ thống đang sử dụng dựa trên `endpoints.ts` và Backend Controllers.

### Xác thực & Người dùng (Auth & User)
*   `POST /api/auth/login`, `register`, `logout`
*   `GET /api/users/me`: Lấy thông tin user hiện tại.

### Quản lý Sản phẩm & Danh mục (Products & Categories)
*   `GET /api/products` & `/api/categories`: Fetch dữ liệu danh mục hiển thị trang chủ.
*   Các API Admin (`POST`, `PUT`, `DELETE`) để quản lý CRUD Sản phẩm và Danh mục.

### Giỏ hàng (Cart)
*   `GET /api/carts`: Lấy giỏ hàng.
*   `POST /api/carts/items`: Thêm vào giỏ.
*   `PUT /api/carts/items/{id}` & `DELETE`: Chỉnh sửa/Xóa.

### Đơn hàng B2C (Orders)
*   **Customer:**
    *   `POST /api/orders/checkout`: Thanh toán giỏ hàng.
    *   `GET /api/orders/my-orders`: Lịch sử đơn.
    *   `POST /api/orders/{id}/cancel`: Hủy đơn.
*   **Admin / Seller:**
    *   `GET /api/orders/admin`: Danh sách toàn bộ đơn.
    *   `PUT /api/orders/admin/{id}/status`: Cập nhật tiến độ (Đang xử lý, Giao hàng,...).
    *   `PUT /api/orders/admin/{id}/payment`: Xác nhận thanh toán.

### Báo giá B2B (Quotes)
*   **Customer (Client Doanh nghiệp):**
    *   `POST /api/quotes`: Gửi yêu cầu báo giá.
    *   `GET /api/quotes/me`: Xem các báo giá đã gửi.
    *   `POST /api/quotes/{id}/reply`: Phản hồi Accept/Reject giá từ Admin.
*   **Admin / Seller:**
    *   `GET /api/quotes/admin`: Xem tất cả yêu cầu báo giá.
    *   `POST /api/quotes/admin/{id}/assign`: Sale nhận giải quyết báo giá này.
    *   `POST /api/quotes/admin/{id}/provide-pricing`: Rep lại giá chi tiết cho khách.
