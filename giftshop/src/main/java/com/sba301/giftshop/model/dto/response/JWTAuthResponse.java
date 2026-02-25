package com.sba301.giftshop.model.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JWTAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public JWTAuthResponse(String token) {
        this.accessToken = token;
    }
}