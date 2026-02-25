package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.QuoteResponse;
import com.sba301.giftshop.model.entity.Quote;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, QuoteProductMapper.class})
public interface QuoteMapper {
    QuoteResponse toResponse(Quote quote);
    List<QuoteResponse> toResponseList(List<Quote> quotes);
}