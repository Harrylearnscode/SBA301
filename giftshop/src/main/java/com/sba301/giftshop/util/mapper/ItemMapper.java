package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.ItemDetailResponse;
import com.sba301.giftshop.model.dto.response.ItemResponse;
import com.sba301.giftshop.model.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    ItemResponse toResponse(Item item);
    List<ItemResponse> toResponseList(List<Item> items);

    @Mapping(source = "product.name", target = "productName")
    ItemDetailResponse toDetailResponse(Item item);
    List<ItemDetailResponse> toDetailResponseList(List<Item> items);
}