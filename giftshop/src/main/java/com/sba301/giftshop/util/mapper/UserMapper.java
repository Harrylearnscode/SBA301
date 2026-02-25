package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.CorporateProfileResponse;
import com.sba301.giftshop.model.dto.response.UserResponse;
import com.sba301.giftshop.model.entity.CorporateProfile;
import com.sba301.giftshop.model.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // MapStruct sẽ tự động map các trường cùng tên, bao gồm cả object lồng nhau (corporateProfile)
    UserResponse toResponse(User user);

    CorporateProfileResponse toResponse(CorporateProfile corporateProfile);

    List<UserResponse> toResponseList(List<User> users);
}