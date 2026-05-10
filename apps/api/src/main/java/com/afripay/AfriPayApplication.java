package com.afripay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * AfriDevPay — Payment Orchestration Platform
 *
 * <p>Architecture: Hexagonal (Ports & Adapters)
 * <p>Java 21 Virtual Threads enabled for high-throughput I/O.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableAsync
@EnableScheduling
public class AfriPayApplication {

    public static void main(String[] args) {
        SpringApplication.run(AfriPayApplication.class, args);
    }
}
