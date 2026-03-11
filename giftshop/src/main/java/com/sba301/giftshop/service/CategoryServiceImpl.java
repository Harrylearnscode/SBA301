package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.CategoryRequest;
import com.sba301.giftshop.model.dto.response.CategoryResponse;
import com.sba301.giftshop.model.entity.Category;
import com.sba301.giftshop.repository.CategoryRepository;
import com.sba301.giftshop.service.CategoryService;
import com.sba301.giftshop.util.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryMapper.toResponseList(categoryRepository.findAll());
    }

    @Override
    public List<CategoryResponse> getRootCategories() {
        // Chỉ lấy các danh mục cấp 1 (Parent là null)
        return categoryMapper.toResponseList(categoryRepository.findByParentIsNull());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .build();

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha"));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        if (request.getName() != null) {
            category.setName(request.getName());
        }

        // Cập nhật danh mục cha nếu có truyền lên
        if (request.getParentId() != null) {
            // Không cho phép set parent là chính nó
            if (request.getParentId().equals(id)) {
                throw new RuntimeException("Danh mục không thể làm cha của chính nó");
            }
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục cha"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            throw new RuntimeException("Không thể xóa danh mục này vì vẫn còn danh mục con");
        }

        categoryRepository.deleteById(id);
    }
}