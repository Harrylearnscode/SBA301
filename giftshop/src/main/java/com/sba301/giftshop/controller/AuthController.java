package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.LoginRequest;
import com.sba301.giftshop.model.dto.request.RegisterRequest;
import com.sba301.giftshop.model.dto.response.JWTAuthResponse;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody LoginRequest loginRequest) {
        JWTAuthResponse authResponse = userService.login(loginRequest);

        ResponseObject response = ResponseObject.builder()
                .code("200")
                .message("Login successful")
                .data(authResponse)
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseObject> register(@RequestBody RegisterRequest registerRequest) {
        User registeredUser = userService.register(registerRequest);

        // Tránh trả về password hash trong response
        registeredUser.setPasswordHash(null);

        ResponseObject response = ResponseObject.builder()
                .code("201")
                .message("User registered successfully")
                .data(registeredUser)
                .isSuccess(true)
                .status(HttpStatus.CREATED)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseObject> logout() {
        // Bạn đã implement chính xác: clear server context, client tự xóa token
        SecurityContextHolder.clearContext();

        ResponseObject response = ResponseObject.builder()
                .code("200")
                .message("Logged out successfully. Please discard your token.")
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }
}