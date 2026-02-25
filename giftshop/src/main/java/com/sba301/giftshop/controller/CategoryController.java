package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.CategoryRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCategories() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy danh sách danh mục thành công")
                .data(categoryService.getAllCategories())
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @GetMapping("/roots")
    public ResponseEntity<ResponseObject> getRootCategories() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy danh sách danh mục gốc thành công")
                .data(categoryService.getRootCategories())
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy thông tin danh mục thành công")
                .data(categoryService.getCategoryById(id))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createCategory(@RequestBody CategoryRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201")
                .message("Tạo danh mục thành công")
                .data(categoryService.createCategory(request))
                .isSuccess(true)
                .status(HttpStatus.CREATED)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Cập nhật danh mục thành công")
                .data(categoryService.updateCategory(id, request))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Xóa danh mục thành công")
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }
}