package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProductItemRequest;
import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ProductResponse;
import com.sba301.giftshop.model.dto.response.ProductSumaryResponse;
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
import org.springframework.web.multipart.MultipartFile;

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
    public List<ProductSumaryResponse> getAllProducts(Boolean onlyActive) {
        List<Product> products = Boolean.TRUE.equals(onlyActive)
                ? productRepository.findByIsActiveTrue()
                : productRepository.findAll();
        return productMapper.toSummaryResponseList(products);
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

    // Thêm Inject R2StorageService vào đầu file
    private final R2StorageService r2StorageService;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, MultipartFile image, Long creatorId) {
        User creator = userRepository.findById(creatorId).orElse(null);
        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        Product productToSave = productMapper.toEntity(request);
        productToSave.setCategory(category);
        productToSave.setCreatedBy(creator);

        // NẾU CÓ FILE ẢNH -> UPLOAD LÊN R2 VÀ LẤY URL GÁN VÀO PRODUCT
        if (image != null && !image.isEmpty()) {
            String imageUrl = r2StorageService.uploadFile(image);
            productToSave.setImageUrl(imageUrl);
        }

        Product savedProduct = productRepository.save(productToSave);

        if (Boolean.TRUE.equals(savedProduct.getIsGift()) && request.getGiftComponents() != null) {
            saveGiftComponents(savedProduct, request.getGiftComponents());
        }

        return getProductById(savedProduct.getId());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile image) {
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
        product.setIsGift(request.getIsGift());
        product.setIsActive(request.getIsActive());

        // CHỈ UPLOAD ẢNH MỚI NẾU CÓ FILE TRUYỀN LÊN
        if (image != null && !image.isEmpty()) {
            String imageUrl = r2StorageService.uploadFile(image);
            product.setImageUrl(imageUrl);
        }
        // Nếu image rỗng, giữ nguyên imageUrl cũ trong DB

        Product updatedProduct = productRepository.save(product);

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