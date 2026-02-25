package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.LoginRequest;
import com.sba301.giftshop.model.dto.request.RegisterRequest;
import com.sba301.giftshop.model.dto.request.UserRequest;
import com.sba301.giftshop.model.dto.response.JWTAuthResponse;
import com.sba301.giftshop.model.dto.response.UserResponse;
import com.sba301.giftshop.model.entity.CorporateProfile;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.model.enums.Role;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.security.JwtTokenProvider;
import com.sba301.giftshop.service.UserService;
import com.sba301.giftshop.util.mapper.UserMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper; // Thêm UserMapper đã dùng MapStruct

    @Override
    public JWTAuthResponse login(LoginRequest loginRequest) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(authentication);

        return new JWTAuthResponse(token);
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        // Có thể thêm logic kiểm tra username/email đã tồn tại ở đây (throw exception nếu có)

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .role(Role.CUSTOMER) // Role được set cứng thành CUSTOMER theo ý bạn
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse) // Gọi đúng phương thức toResponse của MapStruct
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với id: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .role(request.getRole())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .createdAt(LocalDateTime.now())
                .build();

        // Xử lý thông tin CorporateProfile nếu có
        if (request.getCorporateProfile() != null) {
            CorporateProfile profile = CorporateProfile.builder()
                    .companyName(request.getCorporateProfile().getCompanyName())
                    .taxId(request.getCorporateProfile().getTaxId())
                    .addressReg(request.getCorporateProfile().getAddressReg())
                    .creditLimit(request.getCorporateProfile().getCreditLimit())
                    .currentDebt(request.getCorporateProfile().getCurrentDebt())
                    .logoUrl(request.getCorporateProfile().getLogoUrl())
                    .user(user) // Gán ngược lại user để lưu khóa ngoại
                    .build();
            user.setCorporateProfile(profile);
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với id: " + id));

        // Cập nhật thông tin cơ bản
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        if (request.getRole() != null) user.setRole(request.getRole());

        // Cập nhật mật khẩu nếu có truyền lên
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Cập nhật hoặc tạo mới CorporateProfile
        if (request.getCorporateProfile() != null) {
            CorporateProfile profile = user.getCorporateProfile();
            if (profile == null) {
                profile = new CorporateProfile();
                profile.setUser(user);
            }
            profile.setCompanyName(request.getCorporateProfile().getCompanyName());
            profile.setTaxId(request.getCorporateProfile().getTaxId());
            profile.setAddressReg(request.getCorporateProfile().getAddressReg());
            profile.setCreditLimit(request.getCorporateProfile().getCreditLimit());
            profile.setCurrentDebt(request.getCorporateProfile().getCurrentDebt());
            profile.setLogoUrl(request.getCorporateProfile().getLogoUrl());

            user.setCorporateProfile(profile);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User không tồn tại với id: " + id);
        }
        // Do đã set cascade = CascadeType.ALL, xóa User sẽ tự động xóa luôn CorporateProfile
        userRepository.deleteById(id);
    }
}