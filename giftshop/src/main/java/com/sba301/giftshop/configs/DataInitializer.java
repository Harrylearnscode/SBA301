package com.sba301.giftshop.configs;

import com.sba301.giftshop.model.entity.Category;
import com.sba301.giftshop.model.entity.Item;
import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.model.enums.Role;
import com.sba301.giftshop.repository.CategoryRepository;
import com.sba301.giftshop.repository.ItemRepository;
import com.sba301.giftshop.repository.ProductItemRepository;
import com.sba301.giftshop.repository.ProductRepository;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.model.entity.ProductItem;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ItemRepository itemRepository;
    private final ProductItemRepository productItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== ĐANG KHỞI TẠO DỮ LIỆU HỆ THỐNG =====");
        
        // 1. Khởi tạo Users
        User admin = initUser("admin", "123456", "admin@giftshop.com", "Quản trị viên", Role.ADMIN);
        initUser("u", "1", "customer@giftshop.com", "Khách hàng VIP", Role.CUSTOMER);

        // 2. Khởi tạo Categories
        Category catGiftBox = initCategory("Hộp Quà Tết Mộc Bản");
        Category catWine = initCategory("Rượu Vang Nhập Khẩu");
        Category catNut = initCategory("Hạt Dinh Dưỡng");
        Category catTea = initCategory("Trà & Cà Phê");
        Category catSweet = initCategory("Bánh Kẹo");
        Category catDried = initCategory("Trái Cây Sấy");

        // 3. Khởi tạo Sản phẩm
        
        // Nhóm 1: Sản phẩm cốt lõi
        Product p1 = initProduct("Hộp Quà Tết Thịnh Vượng 2026", "HQ-TV-26", "1500000", "Hộp quà Tết cao cấp.", "https://bizweb.dktcdn.net/100/409/006/products/hp-qu-tt-chcan-h-p-10.jpg?v=1637508092283", true, catGiftBox, admin);
        Product p2 = initProduct("Hạt Điều Rang Muối Bình Phước (500g)", "HD-BP-500", "180000", "Hạt điều loại 1.", "https://product.hstatic.net/200000452317/product/hat-dieu-rang-muoi-a-coi-1_9e47228801d94bd9b01ddfceb3c3dced_master.jpg", false, catNut, admin);
        Product p3 = initProduct("Rượu Vang Đỏ Chile Cabernet Sauvignon", "RV-CHI-01", "850000", "Vang đỏ nhập khẩu.", "https://khoruou.com/wp-content/uploads/2020/08/ruou-vang-chile-1865-cabernet-sauvignon.jpg", false, catWine, admin);

        // Nhóm 2: Vỏ hộp cho Custom Gift
        Product p4 = initProduct("Vỏ Hộp Gỗ Cao Cấp", "BOX-WOOD-01", "150000", "Vỏ hộp gỗ sang trọng dùng để custom.", "https://bizweb.dktcdn.net/100/409/006/products/hp-qu-tt-chcan-h-p-10.jpg?v=1637508092283", false, catGiftBox, admin);
        Product p5 = initProduct("Vỏ Hộp Giấy Carton Lễ Hội", "BOX-CART-02", "50000", "Vỏ hộp giấy in họa tiết Tết.", "https://down-vn.imgsusercontent.com/file/vn-11134201-7qu5l-lgrf3o2x9q9v9d", false, catGiftBox, admin);

        // Nhóm 3: Các sản phẩm lẻ mới (Trà, Bánh, Mứt)
        Product p6 = initProduct("Trà Ô Long Thượng Hạng", "TEA-OL-01", "120000", "Trà ô long vùng cao.", "https://traolong.com/wp-content/uploads/2019/11/tra-o-long-thanh-tam-250g-1.jpg", false, catTea, admin);
        Product p7 = initProduct("Cà Phê Arabica Cầu Đất", "COF-AR-02", "250000", "Cà phê hạt rang mộc.", "https://caphecaudat.com/wp-content/uploads/2020/07/arabica-cau-dat-1.jpg", false, catTea, admin);
        Product p8 = initProduct("Bánh Quy Bơ Danisa (200g)", "SWE-B-01", "65000", "Bánh quy nhập khẩu.", "https://cdn.tgdd.vn/Products/Images/3364/79899/bh-danisa-200g-20230807-151025-600x600.jpg", false, catSweet, admin);
        Product p9 = initProduct("Kẹo Dẻo Trái Cây Mix", "SWE-K-02", "45000", "Kẹo dẻo hương vị tự nhiên.", "https://lzd-img-global.slatic.net/g/p/6d3c1664fb979e2c4864f1c9f80c6c6b.jpg", false, catSweet, admin);
        Product p10 = initProduct("Xoài Sấy Dẻo (150g)", "DRI-X-01", "85000", "Xoài sấy dẻo không đường.", "https://nonglamfood.com/wp-content/uploads/2019/07/xoai-say-deo-nong-lam-food.jpg", false, catDried, admin);
        Product p11 = initProduct("Mứt Dừa Non Sữa", "DRI-D-02", "95000", "Mứt dừa đặc sản Bến Tre.", "https://mutduanonbentre.com/wp-content/uploads/2020/01/mut-dua-non-sua.jpg", false, catDried, admin);

        // 4. Liên kết thành phần cho Hộp quà sẵn (p1)
        initGiftComponents(p1, List.of(
            ProductItem.builder().customGift(p1).product(p2).quantity(2).build(),
            ProductItem.builder().customGift(p1).product(p3).quantity(1).build()
        ));

        // 5. Khởi tạo Lô hàng (Batches) cho tất cả sản phẩm
        addBatchesIfMissing(p1, "GIFT");
        addBatchesIfMissing(p2, "NUT");
        addBatchesIfMissing(p3, "WINE");
        addBatchesIfMissing(p4, "BOX1");
        addBatchesIfMissing(p5, "BOX2");
        addBatchesIfMissing(p6, "TEA");
        addBatchesIfMissing(p7, "COF");
        addBatchesIfMissing(p8, "SWE1");
        addBatchesIfMissing(p9, "SWE2");
        addBatchesIfMissing(p10, "DRI1");
        addBatchesIfMissing(p11, "DRI2");

        System.out.println("====== HOÀN TẤT KHỞI TẠO DỮ LIỆU =====");
    }

    private User initUser(String username, String rawPassword, String email, String fullName, Role role) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            user = userRepository.save(User.builder()
                    .username(username)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .email(email)
                    .fullName(fullName)
                    .role(role)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build());
        } else {
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }
        return user;
    }

    private Category initCategory(String name) {
        return categoryRepository.findByName(name).orElseGet(() -> 
            categoryRepository.save(Category.builder().name(name).build())
        );
    }

    private Product initProduct(String name, String sku, String price, String desc, String img, boolean isGift, Category cat, User creator) {
        Product p = productRepository.findBySku(sku);
        if (p == null) {
            p = productRepository.save(Product.builder()
                    .name(name)
                    .sku(sku)
                    .basePrice(new BigDecimal(price))
                    .description(desc)
                    .imageUrl(img)
                    .isGift(isGift)
                    .isActive(true)
                    .category(cat)
                    .createdBy(creator)
                    .build());
        }
        return p;
    }

    private void initGiftComponents(Product gift, List<ProductItem> components) {
        if (gift == null || !gift.getIsGift()) return;
        List<ProductItem> existing = productItemRepository.findByCustomGiftId(gift.getId());
        if (existing.isEmpty()) {
            productItemRepository.saveAll(components);
            System.out.println("=> Đã gán thành phần cho: " + gift.getName());
        }
    }

    private void addBatchesIfMissing(Product product, String prefix) {
        if (product == null) return;
        long count = itemRepository.findByProductId(product.getId()).size();
        if (count < 5) {
            // Lô gần hết hạn (Giảm 50% - <15 ngày)
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-01-EXP").expiredDate(LocalDate.now().plusDays(10)).initialQuantity(100).currentQuantity(100).build());
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-02-EXP").expiredDate(LocalDate.now().plusDays(14)).initialQuantity(150).currentQuantity(150).build());

            // Lô sắp hết hạn (Giảm 30% - <30 ngày)
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-03-WRN").expiredDate(LocalDate.now().plusDays(20)).initialQuantity(200).currentQuantity(200).build());
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-04-WRN").expiredDate(LocalDate.now().plusDays(28)).initialQuantity(250).currentQuantity(250).build());

            // Lô bình thường (Không giảm)
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-05-STD").expiredDate(LocalDate.now().plusMonths(6)).initialQuantity(300).currentQuantity(300).build());
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-06-STD").expiredDate(LocalDate.now().plusMonths(12)).initialQuantity(350).currentQuantity(350).build());
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-07-FAR").expiredDate(LocalDate.now().plusYears(2)).initialQuantity(400).currentQuantity(400).build());
            itemRepository.save(Item.builder().product(product).batchCode(prefix + "-LOT-08-FAR").expiredDate(LocalDate.now().plusYears(3)).initialQuantity(500).currentQuantity(500).build());
        }
    }
}
