package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ItemRequest;
import com.sba301.giftshop.model.dto.response.ItemResponse;
import com.sba301.giftshop.model.entity.Item;
import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.repository.ItemRepository;
import com.sba301.giftshop.repository.ProductRepository;
import com.sba301.giftshop.service.ItemService;
import com.sba301.giftshop.util.mapper.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ProductRepository productRepository;
    private final ItemMapper itemMapper;

    @Override
    @Transactional
    public ItemResponse createItemBatch(ItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Item item = Item.builder()
                .product(product)
                .batchCode(request.getBatchCode())
                .expiredDate(request.getExpiredDate())
                .initialQuantity(request.getInitialQuantity())
                .currentQuantity(request.getInitialQuantity()) // Khi mới nhập, current = initial
                .build();

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public ItemResponse updateItemBatch(Long id, ItemRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lô hàng"));

        if (request.getBatchCode() != null) item.setBatchCode(request.getBatchCode());
        if (request.getExpiredDate() != null) item.setExpiredDate(request.getExpiredDate());

        // Tránh cho phép sửa số lượng tồn kho tự do, nếu cần có thể thêm logic kiểm kê ở đây

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    public List<ItemResponse> getItemsByProductId(Long productId) {
        return itemMapper.toResponseList(itemRepository.findByProductId(productId));
    }

    @Override
    public Integer getTotalAvailableQuantity(Long productId) {
        List<Item> availableItems = itemRepository.findAvailableItems(productId, LocalDate.now());
        return availableItems.stream()
                .mapToInt(Item::getCurrentQuantity)
                .sum();
    }
}