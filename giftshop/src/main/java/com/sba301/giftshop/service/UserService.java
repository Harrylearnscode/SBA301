package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.LoginRequest;
import com.sba301.giftshop.model.dto.request.RegisterRequest;
import com.sba301.giftshop.model.dto.request.UserRequest;
import com.sba301.giftshop.model.dto.response.JWTAuthResponse;
import com.sba301.giftshop.model.dto.response.UserResponse;
import com.sba301.giftshop.model.entity.User;

import java.util.List;

public interface UserService {
    JWTAuthResponse login(LoginRequest loginRequest);
    User register(RegisterRequest registerRequest);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
