package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.QuoteResponse;
import com.sba301.giftshop.model.entity.Quote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, QuoteProductMapper.class, OrderMapper.class})
public interface QuoteMapper {
    @Mapping(source = "order", target = "orderResponse")
    QuoteResponse toResponse(Quote quote);
    List<QuoteResponse> toResponseList(List<Quote> quotes);
}