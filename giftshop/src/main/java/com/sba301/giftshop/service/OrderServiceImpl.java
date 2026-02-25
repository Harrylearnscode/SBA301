package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.CheckoutRequest;
import com.sba301.giftshop.model.dto.request.UpdateOrderStatusRequest;
import com.sba301.giftshop.model.dto.request.UpdatePaymentStatusRequest;
import com.sba301.giftshop.model.dto.response.OrderResponse;
import com.sba301.giftshop.model.entity.*;
import com.sba301.giftshop.model.enums.OrderStatus;
import com.sba301.giftshop.model.enums.PaymentStatus;
import com.sba301.giftshop.repository.ItemRepository;
import com.sba301.giftshop.repository.OrderRepository;
import com.sba301.giftshop.service.CartService;
import com.sba301.giftshop.service.OrderService;
import com.sba301.giftshop.service.PolicyService; // Import thêm PolicyService
import com.sba301.giftshop.util.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ItemRepository itemRepository;
    private final OrderMapper orderMapper;
    private final PolicyService policyService; // Tiêm PolicyService vào đây

    @Override
    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        // 1. Lấy giỏ hàng
        Cart cart = cartService.getCartEntityByUserId(userId);
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng của bạn đang trống");
        }

        // 2. Khởi tạo Đơn hàng (Chưa set TotalPrice, TotalItem, Discount)
        Order order = Order.builder()
                .user(cart.getUser())
                .shippingAddress(request.getShippingAddress())
                .shipperPhoneNumber(request.getShipperPhoneNumber())
                .status(OrderStatus.PENDING)
                .payment(PaymentStatus.UNPAID)
                .orderDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .orderDetails(new ArrayList<>())
                .build();

        BigDecimal rawTotalPrice = BigDecimal.ZERO;
        int totalItem = 0;

        // 3. Xử lý từng sản phẩm trong giỏ (Tính tiền gốc & Trừ tồn kho)
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            int requiredQty = cartItem.getQuantity();

            // Kiểm tra và trừ tồn kho theo FIFO
            deductInventory(product.getId(), requiredQty);

            // Tạo OrderDetail lưu lại giá gốc tại thời điểm mua
            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .unitPrice(product.getBasePrice())
                    .quantity(requiredQty)
                    .build();

            order.getOrderDetails().add(orderDetail);

            // Cộng dồn tổng tiền gốc và tổng số lượng
            rawTotalPrice = rawTotalPrice.add(product.getBasePrice().multiply(BigDecimal.valueOf(requiredQty)));
            totalItem += requiredQty;
        }

        // 4. --- TÍNH GIẢM GIÁ THEO CHÍNH SÁCH SỐ LƯỢNG ---
        Integer discountPercent = policyService.getApplicableDiscount(totalItem);
        BigDecimal finalTotalPrice = rawTotalPrice;

        if (discountPercent > 0) {
            // Tính tỷ lệ giá sau khi giảm. VD: giảm 30% thì tỷ lệ trả là 70% (tức 0.7)
            BigDecimal discountRate = BigDecimal.valueOf(100 - discountPercent)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            finalTotalPrice = rawTotalPrice.multiply(discountRate);
        }

        // SET CÁC THÔNG SỐ TỔNG KẾT VÀO ORDER
        order.setTotalPrice(finalTotalPrice);
        order.setTotalItem(totalItem);
        order.setDiscountApplied(discountPercent); // <-- LƯU MỨC GIẢM GIÁ VÀO DATABASE

        // 5. Lưu đơn hàng
        Order savedOrder = orderRepository.save(order);

        // 6. Làm rỗng giỏ hàng
        cartService.clearCart(userId);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        return orderMapper.toResponseList(orders);
    }

    @Override
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Bảo mật: Chỉ người tạo đơn hoặc Admin mới được xem
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdateDate(LocalDateTime.now());

        // Hoàn lại tồn kho
        for (OrderDetail detail : order.getOrderDetails()) {
            restoreInventory(detail.getProduct().getId(), detail.getQuantity());
        }

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderMapper.toResponseList(orderRepository.findAll());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        order.setStatus(request.getStatus());
        order.setUpdateDate(LocalDateTime.now());
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        order.setPayment(request.getPayment());
        order.setUpdateDate(LocalDateTime.now());
        return orderMapper.toResponse(orderRepository.save(order));
    }

    // --- CÁC HÀM PHỤ TRỢ XỬ LÝ TỒN KHO ---

    private void deductInventory(Long productId, int requiredQty) {
        List<Item> availableItems = itemRepository.findAvailableItems(productId, LocalDate.now());
        int totalAvailable = availableItems.stream().mapToInt(Item::getCurrentQuantity).sum();

        if (totalAvailable < requiredQty) {
            throw new RuntimeException("Sản phẩm ID " + productId + " không đủ số lượng tồn kho");
        }

        int remainingToDeduct = requiredQty;
        for (Item item : availableItems) {
            if (remainingToDeduct == 0) break;

            if (item.getCurrentQuantity() >= remainingToDeduct) {
                item.setCurrentQuantity(item.getCurrentQuantity() - remainingToDeduct);
                remainingToDeduct = 0;
            } else {
                remainingToDeduct -= item.getCurrentQuantity();
                item.setCurrentQuantity(0);
            }
            itemRepository.save(item);
        }
    }

    private void restoreInventory(Long productId, int quantityToRestore) {
        // Tìm lô hàng bất kỳ (còn hạn) để cộng trả lại số lượng
        List<Item> availableItems = itemRepository.findAvailableItems(productId, LocalDate.now());
        if (!availableItems.isEmpty()) {
            Item item = availableItems.get(0);
            item.setCurrentQuantity(item.getCurrentQuantity() + quantityToRestore);
            itemRepository.save(item);
        }
    }
}