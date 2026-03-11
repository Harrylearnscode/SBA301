package com.sba301.giftshop.model.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.sba301.giftshop.model.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private LocalDate dateOfBirth;

    private Boolean isActive;

    private Role role;

    private LocalDateTime createdAt;

    private CorporateProfileResponse corporateProfile;
}
