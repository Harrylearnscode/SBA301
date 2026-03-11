package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.ItemRequest;
import com.sba301.giftshop.model.dto.request.UpdateItemRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<ResponseObject> getAllItems() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Lấy danh sách lô hàng thành công").isSuccess(true).status(HttpStatus.OK)
                .data(itemService.getAllItems())
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createItemBatch(@RequestBody ItemRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201").message("Nhập kho lô hàng thành công").isSuccess(true).status(HttpStatus.CREATED)
                .data(itemService.createItemBatch(request))
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateItemBatch(@PathVariable Long id, @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Cập nhật lô hàng thành công").isSuccess(true).status(HttpStatus.OK)
                .data(itemService.updateItemBatch(id, request))
                .build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResponseObject> getItemsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(itemService.getItemsByProductId(productId))
                .build());
    }

    @GetMapping("/product/{productId}/available")
    public ResponseEntity<ResponseObject> getAvailableQuantity(@PathVariable Long productId) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Lấy số lượng tồn kho thành công").isSuccess(true).status(HttpStatus.OK)
                .data(itemService.getTotalAvailableQuantity(productId))
                .build());
    }
}