package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProductItemRequest;
import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ProductResponse;
import com.sba301.giftshop.model.entity.Category;
import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.model.entity.ProductItem;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.CategoryRepository;
import com.sba301.giftshop.repository.ProductItemRepository;
import com.sba301.giftshop.repository.ProductRepository;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.ProductService;
import com.sba301.giftshop.util.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> getAllProducts(Boolean onlyActive) {
        List<Product> products = Boolean.TRUE.equals(onlyActive)
                ? productRepository.findByIsActiveTrue()
                : productRepository.findAll();
        return productMapper.toResponseList(products);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        // Gắn lại components nếu là quà (do FetchType mặc định có thể là Lazy)
        if (Boolean.TRUE.equals(product.getIsGift())) {
            product.setGiftComponents(productItemRepository.findByCustomGiftId(id));
        }
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, Long creatorId) {
        User creator = userRepository.findById(creatorId).orElse(null);
        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .basePrice(request.getBasePrice())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isGift(request.getIsGift() != null ? request.getIsGift() : false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .category(category)
                .createdBy(creator)
                .build();

        Product savedProduct = productRepository.save(product);

        // Xử lý lưu các sản phẩm thành phần nếu đây là Giỏ Quà
        if (Boolean.TRUE.equals(savedProduct.getIsGift()) && request.getGiftComponents() != null) {
            saveGiftComponents(savedProduct, request.getGiftComponents());
        }

        return getProductById(savedProduct.getId());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setBasePrice(request.getBasePrice());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setIsGift(request.getIsGift());
        product.setIsActive(request.getIsActive());

        Product updatedProduct = productRepository.save(product);

        // Cập nhật các thành phần giỏ quà: Xóa cũ, thêm mới cho an toàn
        if (Boolean.TRUE.equals(updatedProduct.getIsGift()) && request.getGiftComponents() != null) {
            productItemRepository.deleteByCustomGiftId(updatedProduct.getId());
            saveGiftComponents(updatedProduct, request.getGiftComponents());
        }

        return getProductById(updatedProduct.getId());
    }

    @Override
    @Transactional
    public void toggleActiveStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        product.setIsActive(!product.getIsActive());
        productRepository.save(product);
    }

    // Hàm phụ trợ lưu danh sách sản phẩm thành phần
    private void saveGiftComponents(Product customGift, List<ProductItemRequest> components) {
        for (ProductItemRequest compRequest : components) {
            Product componentProduct = productRepository.findById(compRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm thành phần: " + compRequest.getProductId()));

            ProductItem item = ProductItem.builder()
                    .customGift(customGift)
                    .product(componentProduct)
                    .quantity(compRequest.getQuantity())
                    .build();
            productItemRepository.save(item);
        }
    }
}