package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.ProvideQuoteRequest;
import com.sba301.giftshop.model.dto.request.QuoteRequest;
import com.sba301.giftshop.model.dto.response.QuoteResponse;
import com.sba301.giftshop.model.entity.*;
import com.sba301.giftshop.model.enums.QuoteStatus;
import com.sba301.giftshop.model.enums.OrderStatus;
import com.sba301.giftshop.model.enums.PaymentStatus;
import com.sba301.giftshop.model.dto.response.PaymentResponse;
import com.sba301.giftshop.repository.*;

import com.sba301.giftshop.util.mapper.QuoteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sba301.giftshop.model.entity.ProductItem;
import com.sba301.giftshop.repository.ProductItemRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final PaymentService paymentService;
    private final ProductItemRepository productItemRepository;

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
                .validUntil(LocalDateTime.now().plusWeeks(1))
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

            quoteProductRepository.save(quoteProduct);
            savedQuote.getQuoteProducts().add(quoteProduct);

            // TỰ ĐỘNG LẤY LOGO TỪ SẢN PHẨM (Nếu là Custom Gift có logo)
            if (savedQuote.getLogoUrl() == null && quoteProduct.getProduct() != null && quoteProduct.getProduct().getLogoUrl() != null) {
                savedQuote.setLogoUrl(quoteProduct.getProduct().getLogoUrl());
            }
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
    public QuoteResponse replyToQuote(Long quoteId, Long userId, boolean isAccepted, String shippingAddress) {
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
            
            // Tạo Order từ danh sách QuoteProduct
            Order order = Order.builder()
                    .user(quote.getUser())
                    .shippingAddress(shippingAddress)
                    .status(OrderStatus.PENDING)
                    .payment(PaymentStatus.UNPAID)
                    .orderDate(LocalDateTime.now())
                    .updateDate(LocalDateTime.now())
                    .orderDetails(new ArrayList<>())
                    .build();

            int totalItem = 0;

            // Tạo OrderDetail từ QuoteProduct và trừ tồn kho
            for (QuoteProduct quoteProduct : quote.getQuoteProducts()) {
                if (quoteProduct.getQuotedPrice() == null) {
                    throw new RuntimeException("Sản phẩm '" + quoteProduct.getProduct().getName() + "' chưa được báo giá");
                }

                OrderDetail orderDetail = OrderDetail.builder()
                        .order(order)
                        .product(quoteProduct.getProduct())
                        .unitPrice(quoteProduct.getQuotedPrice())
                        .quantity(quoteProduct.getQuantity())
                        .build();

                order.getOrderDetails().add(orderDetail);
                totalItem += quoteProduct.getQuantity();

                // Trừ tồn kho theo FIFO
                deductInventory(quoteProduct.getProduct().getId(), quoteProduct.getQuantity());
            }

            // SET CÁC THÔNG SỐ TỔNG KẾT VÀO ORDER
            order.setTotalPrice(quote.getTotalPrice());
            order.setTotalItem(totalItem);
            order.setDiscountApplied(0); // Giá đã được thỏa thuận bởi Sales

            // Lưu đơn hàng
            Order savedOrder = orderRepository.save(order);

            // Tạo link thanh toán
            PaymentResponse vnpayResponse = paymentService.createPayment(savedOrder.getId(), savedOrder.getTotalPrice(), "FULL");
            String payUrl = vnpayResponse.getPaymentUrl();
            savedOrder.setPayUrl(payUrl);
            savedOrder.setPaidTime(null);
            savedOrder = orderRepository.save(savedOrder);

            // Liên kết 1-1 giữa Quote và Order
            quote.setOrder(savedOrder);

            // SAO CHÉP THÔNG TIN CỌC VÀ LOGO TỪ QUOTE -> ORDER
            savedOrder.setDepositAmount(quote.getDepositAmount());
            if (quote.getLogoUrl() != null) {
                // Ta có thể lưu logoUrl vào ghi chú đơn hàng hoặc mapping vào sp. 
                // Ở đây ta đơn giản là đảm bảo Quote vẫn giữ logo để Admin check.
            }
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

        if (request.getDepositAmount() != null) {
            quote.setDepositAmount(request.getDepositAmount());
        }

        return quoteMapper.toResponse(quoteRepository.save(quote));
    }

    // --- HÀM PHỤ TRỢ XỬ LÝ TỒN KHO ---
    private void deductInventory(Long productId, int requiredQty) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID " + productId));

        if (Boolean.TRUE.equals(product.getIsGift())) {
            List<ProductItem> components = productItemRepository.findByCustomGiftId(productId);
            if (components == null || components.isEmpty()) {
                throw new RuntimeException("Sản phẩm quà ID " + productId + " không có thành phần");
            }

            for (ProductItem comp : components) {
                Long compProductId = comp.getProduct().getId();
                int neededQty = comp.getQuantity() * requiredQty;

                List<Item> availableItems = itemRepository.findAvailableItems(compProductId, LocalDate.now());
                int totalAvailable = availableItems.stream().mapToInt(Item::getCurrentQuantity).sum();

                if (totalAvailable < neededQty) {
                    throw new RuntimeException("Sản phẩm thành phần ID " + compProductId
                            + " không đủ tồn kho cho gói quà ID " + productId);
                }

                deductFromItems(compProductId, neededQty);
            }
        } else {
            deductFromItems(productId, requiredQty);
        }
    }

    private void deductFromItems(Long productId, int requiredQty) {
        List<Item> availableItems = itemRepository.findAvailableItems(productId, LocalDate.now());
        int totalAvailable = availableItems.stream().mapToInt(Item::getCurrentQuantity).sum();

        if (totalAvailable < requiredQty) {
            throw new RuntimeException("Sản phẩm ID " + productId + " không đủ số lượng tồn kho");
        }

        int remainingToDeduct = requiredQty;
        for (Item item : availableItems) {
            if (remainingToDeduct == 0) break;

            int current = item.getCurrentQuantity() == null ? 0 : item.getCurrentQuantity();
            if (current >= remainingToDeduct) {
                item.setCurrentQuantity(current - remainingToDeduct);
                remainingToDeduct = 0;
            } else {
                remainingToDeduct -= current;
                item.setCurrentQuantity(0);
            }
            itemRepository.save(item);
        }
    }
}
