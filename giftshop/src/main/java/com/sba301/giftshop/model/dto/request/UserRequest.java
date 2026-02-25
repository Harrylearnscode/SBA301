package com.sba301.giftshop.model.dto.request;

import com.sba301.giftshop.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private Role role;
    private Boolean isActive;

    // Thông tin công ty đi kèm (nếu có)
    private CorporateProfileRequest corporateProfile;
}