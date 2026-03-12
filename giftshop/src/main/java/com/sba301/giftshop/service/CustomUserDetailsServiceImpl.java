package com.sba301.giftshop.service;

import com.sba301.giftshop.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CustomUserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        var domainUser = userRepository.findByUsername(username);
        if (domainUser == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Đã sửa: Map Role của user thành SimpleGrantedAuthority
        return org.springframework.security.core.userdetails.User
                .withUsername(domainUser.getUsername())
                .password(domainUser.getPasswordHash())
                .authorities(List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + domainUser.getRole().name())))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}