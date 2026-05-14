package com.afripay.adapter.in.web.v1;

import com.afripay.config.security.JwtTokenProvider;
import com.afripay.application.port.out.persistence.MerchantPort;
import com.afripay.domain.model.merchant.Merchant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtTokenProvider tokenProvider;
    private final MerchantPort merchantPort;

    public AuthController(JwtTokenProvider tokenProvider, MerchantPort merchantPort) {
        this.tokenProvider = tokenProvider;
        this.merchantPort = merchantPort;
    }

    public record LoginRequest(String email, String password) {}

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        String email = request.email() != null ? request.email() : "developer@example.com";
        
        Merchant merchant = merchantPort.findByEmail(email).orElseGet(() -> {
            Merchant m = Merchant.register("Developer", email, "CM");
            m.activate();
            merchantPort.save(m);
            return m;
        });

        String token = tokenProvider.generateToken(merchant.getId().toString());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
