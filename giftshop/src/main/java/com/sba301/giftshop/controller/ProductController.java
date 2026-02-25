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

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

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

    @PostMapping
    public ResponseEntity<ResponseObject> createProduct(@RequestBody ProductRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201").message("Tạo sản phẩm thành công").isSuccess(true).status(HttpStatus.CREATED)
                .data(productService.createProduct(request, getCurrentUserId()))
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Cập nhật thành công").isSuccess(true).status(HttpStatus.OK)
                .data(productService.updateProduct(id, request))
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