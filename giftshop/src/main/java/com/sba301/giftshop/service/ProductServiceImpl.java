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
import com.sba301.giftshop.util.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.sba301.giftshop.model.enums.Role;
import java.math.BigDecimal;
import java.util.stream.Collectors;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;
    private final ItemService itemService;

    @Override
    public List<ProductSumaryResponse> getAllProducts(Boolean onlyActive) {
        List<Product> products = Boolean.TRUE.equals(onlyActive)
                ? productRepository.findByIsActiveTrue()
                : productRepository.findAll();

        List<Product> filteredProducts = products.stream()
                .filter(p -> p.getCreatedBy() == null || p.getCreatedBy().getRole() == Role.ADMIN)
                .collect(Collectors.toList());

        List<ProductSumaryResponse> responses = productMapper.toSummaryResponseList(filteredProducts);
        for (ProductSumaryResponse res : responses) {
            res.setBasePrice(itemService.calculateFefoPrice(res.getId(), res.getBasePrice()));
        }
        return responses;
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        // Gắn lại components nếu là quà (do FetchType mặc định có thể là Lazy)
        if (Boolean.TRUE.equals(product.getIsGift())) {
            product.setGiftComponents(productItemRepository.findByCustomGiftId(id));
        }
        ProductResponse res = productMapper.toResponse(product);
        res.setBasePrice(itemService.calculateFefoPrice(res.getId(), res.getBasePrice()));
        return res;
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

        // Xác định xem đây có phải là Giỏ quà không
        // (Do Admin tick chọn isGift = true từ UI, hoặc do Khách hàng tự thiết kế)
        boolean isCustomer = creator != null && creator.getRole() == Role.CUSTOMER;
        boolean isGiftProduct = Boolean.TRUE.equals(request.getIsGift()) || isCustomer;

        // --- LOGIC: TỰ ĐỘNG TÍNH GIÁ NẾU LÀ GIỎ QUÀ ---
        if (isGiftProduct) {
            productToSave.setIsGift(true);

            // CHỈ tự động tính và ghi đè giá NẾU có chọn các món đồ thành phần
            if (request.getGiftComponents() != null && !request.getGiftComponents().isEmpty()) {
                BigDecimal totalSecurePrice = BigDecimal.ZERO;

                for (ProductItemRequest comp : request.getGiftComponents()) {
                    Product component = productRepository.findById(comp.getProductId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm thành phần"));

                    BigDecimal componentPrice = itemService.calculateFefoPrice(component.getId(), component.getBasePrice());
                    BigDecimal lineTotal = componentPrice.multiply(BigDecimal.valueOf(comp.getQuantity()));
                    totalSecurePrice = totalSecurePrice.add(lineTotal);
                }
                // Ghi đè giá bằng tổng tiền các món
                productToSave.setBasePrice(totalSecurePrice);
            }
            // NẾU KHÔNG CÓ THÀNH PHẦN: Hệ thống sẽ tự động giữ nguyên basePrice
            // mà Admin đã nhập tay (được map từ request sang productToSave trước đó).
        }

        // Logic bảo mật riêng: Nếu khách hàng tự tạo, bắt buộc ẩn khỏi trang chủ Shop
        if (isCustomer) {
            productToSave.setIsActive(false);
        }

        // Xử lý upload ảnh (nếu có)
        if (image != null && !image.isEmpty()) {
            String imageUrl = r2StorageService.uploadFile(image);
            productToSave.setImageUrl(imageUrl);
        }

        Product savedProduct = productRepository.save(productToSave);

        // Lưu danh sách các món đồ vào Database
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