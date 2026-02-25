package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.QuoteProductResponse;
import com.sba301.giftshop.model.entity.QuoteProduct;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface QuoteProductMapper {
    QuoteProductResponse toResponse(QuoteProduct quoteProduct);
    List<QuoteProductResponse> toResponseList(List<QuoteProduct> quoteProducts);
}