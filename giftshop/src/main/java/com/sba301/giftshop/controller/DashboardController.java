package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.response.DashboardResponse;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/analytics")
    public ResponseEntity<ResponseObject> getAnalytics() {
        DashboardResponse data = dashboardService.getDashboardAnalytics();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("success")
                .message("Lấy dữ liệu dashboard thành công")
                .data(data)
                .isSuccess(true)
                .status(org.springframework.http.HttpStatus.OK)
                .build());
    }
}
