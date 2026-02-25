package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.ItemResponse;
import com.sba301.giftshop.model.entity.Item;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    ItemResponse toResponse(Item item);
    List<ItemResponse> toResponseList(List<Item> items);
}