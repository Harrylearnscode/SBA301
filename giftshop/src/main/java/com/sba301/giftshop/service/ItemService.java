package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ItemRequest;
import com.sba301.giftshop.model.dto.response.ItemResponse;

import java.util.List;

public interface ItemService {
    ItemResponse createItemBatch(ItemRequest request);
    ItemResponse updateItemBatch(Long id, ItemRequest request);
    List<ItemResponse> getItemsByProductId(Long productId);
    Integer getTotalAvailableQuantity(Long productId);
}
