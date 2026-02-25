package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.PolicyRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    // --- CÁC API DÀNH CHO QUẢN LÝ TẠO/SỬA MỐC GIẢM GIÁ ---

    @PostMapping
    public ResponseEntity<ResponseObject> createPolicy(@RequestBody PolicyRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201").message("Tạo chính sách giảm giá thành công").isSuccess(true).status(HttpStatus.CREATED)
                .data(policyService.createPolicy(request))
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updatePolicy(@PathVariable Long id, @RequestBody PolicyRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Cập nhật chính sách thành công").isSuccess(true).status(HttpStatus.OK)
                .data(policyService.updatePolicy(id, request))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Xóa chính sách thành công").isSuccess(true).status(HttpStatus.OK)
                .build());
    }

    // --- CÁC API DÙNG CHUNG ĐỂ HIỂN THỊ HOẶC TEST ---

    @GetMapping
    public ResponseEntity<ResponseObject> getAllPolicies() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(policyService.getAllPolicies())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(policyService.getPolicyById(id))
                .build());
    }

    @GetMapping("/check-discount")
    public ResponseEntity<ResponseObject> checkDiscount(@RequestParam Integer quantity) {
        Integer discount = policyService.getApplicableDiscount(quantity);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Mức giảm giá hiện tại")
                .isSuccess(true).status(HttpStatus.OK)
                .data(discount) // Trả về số nguyên, ví dụ: 30
                .build());
    }
}