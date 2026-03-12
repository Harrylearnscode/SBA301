package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        return user != null ? user.getId() : null;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllProducts(@RequestParam(defaultValue = "true") Boolean onlyActive) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(productService.getAllProducts(onlyActive))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(productService.getProductById(id))
                .build());
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> createProduct(
            // Dòng này báo cho Swagger biết hãy vẽ giao diện JSON của ProductRequest
            @Parameter(schema = @Schema(implementation = ProductRequest.class))
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws JsonProcessingException {

        // Java vẫn nhận String để tránh lỗi, rồi tự convert an toàn
        ProductRequest request = objectMapper.readValue(productJson, ProductRequest.class);

        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("201")
                .message("Tạo sản phẩm thành công")
                .data(productService.createProduct(request, image, userId))
                .isSuccess(true)
                .status(HttpStatus.CREATED)
                .build());
    }

    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> updateProduct(
            @PathVariable Long id,
            // Thêm annotation tương tự cho hàm Update
            @Parameter(schema = @Schema(implementation = ProductRequest.class))
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws JsonProcessingException {

        ProductRequest request = objectMapper.readValue(productJson, ProductRequest.class);

        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Cập nhật sản phẩm thành công")
                .data(productService.updateProduct(id, request, image))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseObject> toggleActiveStatus(@PathVariable Long id) {
        productService.toggleActiveStatus(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Đã thay đổi trạng thái sản phẩm").isSuccess(true).status(HttpStatus.OK)
                .build());
    }
}