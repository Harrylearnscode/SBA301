package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProvideQuoteRequest;
import com.sba301.giftshop.model.dto.request.QuoteRequest;
import com.sba301.giftshop.model.dto.response.QuoteResponse;
import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.model.entity.Quote;
import com.sba301.giftshop.model.entity.QuoteProduct;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.model.enums.QuoteStatus;
import com.sba301.giftshop.repository.ProductRepository;
import com.sba301.giftshop.repository.QuoteProductRepository;
import com.sba301.giftshop.repository.QuoteRepository;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.QuoteService;
import com.sba301.giftshop.util.mapper.QuoteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteProductRepository quoteProductRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final QuoteMapper quoteMapper;

    @Override
    @Transactional
    public QuoteResponse createQuote(Long userId, QuoteRequest request) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 1. Khởi tạo Quote
        Quote quote = Quote.builder()
                .user(customer)
                .status(QuoteStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .totalPrice(BigDecimal.ZERO) // Giá trị bằng 0 cho đến khi Sale báo giá
                .quoteProducts(new ArrayList<>())
                .build();

        Quote savedQuote = quoteRepository.save(quote);

        // 2. Lưu danh sách sản phẩm khách yêu cầu
        for (QuoteRequest.QuoteItemRequest itemReq : request.getItems()) {
            QuoteProduct quoteProduct = new QuoteProduct();
            quoteProduct.setQuote(savedQuote);
            quoteProduct.setQuantity(itemReq.getQuantity());

            if (itemReq.getProductId() != null) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
                quoteProduct.setProduct(product);
            }
            if (itemReq.getCustomGiftId() != null) {
                Product customGift = productRepository.findById(itemReq.getCustomGiftId())
                        .orElseThrow(() -> new RuntimeException("Giỏ quà không tồn tại"));
                quoteProduct.setCustomGift(customGift);
            }

            quoteProductRepository.save(quoteProduct);
            savedQuote.getQuoteProducts().add(quoteProduct);
        }

        return quoteMapper.toResponse(savedQuote);
    }

    @Override
    public List<QuoteResponse> getMyQuotes(Long userId) {
        List<Quote> quotes = quoteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return quoteMapper.toResponseList(quotes);
    }

    @Override
    public QuoteResponse getQuoteById(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn"));

        // Chỉ khách tạo yêu cầu hoặc nhân viên mới được xem
        if (!quote.getUser().getId().equals(userId) &&
                (quote.getSalesStaff() == null || !quote.getSalesStaff().getId().equals(userId))) {
            throw new RuntimeException("Bạn không có quyền xem thông tin này");
        }
        return quoteMapper.toResponse(quote);
    }

    @Override
    @Transactional
    public QuoteResponse replyToQuote(Long quoteId, Long userId, boolean isAccepted) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn"));

        if (!quote.getUser().getId().equals(userId)) {
            throw new RuntimeException("Chỉ khách hàng tạo yêu cầu mới được phản hồi");
        }
        if (quote.getStatus() != QuoteStatus.QUOTED) {
            throw new RuntimeException("Yêu cầu này chưa được Sale báo giá hoặc đã đóng");
        }

        if (isAccepted) {
            quote.setStatus(QuoteStatus.ACCEPTED);
            // TODO: (Tùy chọn) Gọi hàm tạo Order từ danh sách QuoteProduct ở đây
        } else {
            quote.setStatus(QuoteStatus.REJECTED);
        }

        return quoteMapper.toResponse(quoteRepository.save(quote));
    }

    @Override
    @Transactional
    public QuoteResponse cancelQuote(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn"));

        if (!quote.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy");
        }
        if (quote.getStatus() != QuoteStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể hủy khi yêu cầu đang ở trạng thái chờ");
        }

        quote.setStatus(QuoteStatus.CANCELLED);
        return quoteMapper.toResponse(quoteRepository.save(quote));
    }

    @Override
    public List<QuoteResponse> getAllQuotes() {
        return quoteMapper.toResponseList(quoteRepository.findAll());
    }

    @Override
    @Transactional
    public QuoteResponse assignToMe(Long quoteId, Long staffId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn"));

        if (quote.getStatus() != QuoteStatus.PENDING) {
            throw new RuntimeException("Yêu cầu này đã có người xử lý");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        quote.setSalesStaff(staff);
        quote.setStatus(QuoteStatus.PROCESSING);

        return quoteMapper.toResponse(quoteRepository.save(quote));
    }

    @Override
    @Transactional
    public QuoteResponse providePricing(Long quoteId, Long staffId, ProvideQuoteRequest request) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn"));

        if (!quote.getSalesStaff().getId().equals(staffId)) {
            throw new RuntimeException("Bạn không phải nhân viên phụ trách yêu cầu này");
        }

        BigDecimal totalPrice = BigDecimal.ZERO;

        // Cập nhật giá cho từng sản phẩm
        for (ProvideQuoteRequest.QuoteItemPriceRequest priceReq : request.getItemPrices()) {
            QuoteProduct quoteProduct = quoteProductRepository.findById(priceReq.getQuoteProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong yêu cầu"));

            if (!quoteProduct.getQuote().getId().equals(quoteId)) {
                throw new RuntimeException("Sản phẩm không thuộc yêu cầu báo giá này");
            }

            // Lưu giá nhân viên đã chốt (đơn giá sau khi đã thỏa thuận)
            quoteProduct.setQuotedPrice(priceReq.getQuotedPrice());
            quoteProductRepository.save(quoteProduct);

            // Tính tổng tiền: Đơn giá chốt * Số lượng
            BigDecimal itemTotal = priceReq.getQuotedPrice().multiply(BigDecimal.valueOf(quoteProduct.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);
        }

        // Cập nhật thông tin lên Quote tổng
        quote.setTotalPrice(totalPrice);
        quote.setValidUntil(request.getValidUntil());
        quote.setStatus(QuoteStatus.QUOTED); // Chuyển trạng thái để khách hàng thấy được giá

        return quoteMapper.toResponse(quoteRepository.save(quote));
    }
}