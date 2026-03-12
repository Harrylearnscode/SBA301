package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.UserRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.dto.response.UserResponse;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Người dùng chưa đăng nhập hoặc không tồn tại");
        }
        return user.getId();
    }


    @GetMapping
    public ResponseEntity<ResponseObject> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy danh sách người dùng thành công")
                .data(users)
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseObject> getMyProfile() {
        Long userId = getCurrentUserId(); // Tự động lấy ID từ Token
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy thông tin cá nhân thành công")
                .data(user)
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<ResponseObject> updateMyProfile(@RequestBody UserRequest request) {
        Long userId = getCurrentUserId(); // Tự động lấy ID người đang đăng nhập
        UserResponse updatedUser = userService.updateUser(userId, request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Cập nhật thông tin cá nhân thành công")
                .data(updatedUser)
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createUser(@RequestBody UserRequest request) {
        UserResponse createdUser = userService.createUser(request);
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201")
                .message("Tạo người dùng thành công")
                .data(createdUser)
                .isSuccess(true)
                .status(HttpStatus.CREATED)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Cập nhật người dùng thành công")
                .data(updatedUser)
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Xóa người dùng thành công")
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }
}