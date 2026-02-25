package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.CategoryResponse;
import com.sba301.giftshop.model.entity.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    // MapStruct sẽ tự động map thuộc tính subCategories do cùng tên và kiểu dữ liệu tương ứng
    CategoryResponse toResponse(Category category);
    List<CategoryResponse> toResponseList(List<Category> categories);
}