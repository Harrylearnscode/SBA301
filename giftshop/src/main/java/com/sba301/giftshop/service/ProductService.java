package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ProductResponse;
import com.sba301.giftshop.model.dto.response.ProductSumaryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<ProductSumaryResponse> getAllProducts(Boolean onlyActive);
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request, MultipartFile image, Long creatorId);
    ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile image);
    void toggleActiveStatus(Long id); // Soft delete
}
