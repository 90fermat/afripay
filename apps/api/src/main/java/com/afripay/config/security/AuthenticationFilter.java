package com.afripay.config.security;

import com.afripay.adapter.out.persistence.entity.ApiKeyEntity;
import com.afripay.adapter.out.persistence.repository.ApiKeyJpaRepository;
import com.afripay.domain.model.apikey.ApiKey;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final ApiKeyJpaRepository apiKeyRepository;

    public AuthenticationFilter(JwtTokenProvider tokenProvider, ApiKeyJpaRepository apiKeyRepository) {
        this.tokenProvider = tokenProvider;
        this.apiKeyRepository = apiKeyRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String bearerToken = extractToken(request);

        if (StringUtils.hasText(bearerToken)) {
            if (bearerToken.startsWith("apk_")) {
                authenticateWithApiKey(bearerToken);
            } else if (tokenProvider.validateToken(bearerToken)) {
                authenticateWithJwt(bearerToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateWithJwt(String token) {
        String merchantId = tokenProvider.getMerchantIdFromToken(token);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                merchantId, null, List.of(new SimpleGrantedAuthority("ROLE_MERCHANT")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void authenticateWithApiKey(String rawKey) {
        String hash = ApiKey.sha256(rawKey);
        Optional<ApiKeyEntity> apiKeyOpt = apiKeyRepository.findByKeyHash(hash);
        
        if (apiKeyOpt.isPresent() && apiKeyOpt.get().isActive()) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    apiKeyOpt.get().getMerchantId().toString(), null, List.of(new SimpleGrantedAuthority("ROLE_API")));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
