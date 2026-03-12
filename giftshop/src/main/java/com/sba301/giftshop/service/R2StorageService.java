package com.sba301.giftshop.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class R2StorageService {

    private final AmazonS3 s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucketName;

    @Value("${cloudflare.r2.publicUrl}")
    private String publicUrl;

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Đổi tên file để tránh trùng lặp
            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // Upload lên Cloudflare R2
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata));

            // Trả về đường dẫn Public URL của ảnh
            return publicUrl + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload file lên Cloudflare R2: " + e.getMessage());
        }
    }
}