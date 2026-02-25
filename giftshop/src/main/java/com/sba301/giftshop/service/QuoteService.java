package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProvideQuoteRequest;
import com.sba301.giftshop.model.dto.request.QuoteRequest;
import com.sba301.giftshop.model.dto.response.QuoteResponse;

import java.util.List;

public interface QuoteService {
    // --- Dành cho Khách hàng ---
    QuoteResponse createQuote(Long userId, QuoteRequest request);
    List<QuoteResponse> getMyQuotes(Long userId);
    QuoteResponse getQuoteById(Long quoteId, Long userId);
    QuoteResponse replyToQuote(Long quoteId, Long userId, boolean isAccepted); // Khách chốt đơn hoặc từ chối
    QuoteResponse cancelQuote(Long quoteId, Long userId); // Khách tự hủy khi chưa xử lý

    // --- Dành cho Nhân viên Sale / Admin ---
    List<QuoteResponse> getAllQuotes();
    QuoteResponse assignToMe(Long quoteId, Long staffId); // Nhận đơn để tư vấn
    QuoteResponse providePricing(Long quoteId, Long staffId, ProvideQuoteRequest request); // Cập nhật giá chốt
}
