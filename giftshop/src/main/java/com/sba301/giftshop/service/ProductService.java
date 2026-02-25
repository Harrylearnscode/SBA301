package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts(Boolean onlyActive);
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request, Long creatorId);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void toggleActiveStatus(Long id); // Soft delete
}
