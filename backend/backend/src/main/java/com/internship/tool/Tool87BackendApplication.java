package com.internship.tool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableScheduling          // ⏰ Scheduler (email alerts)
@EnableJpaAuditing         // 🕒 Auditing (createdAt, updatedAt)
@EnableAsync               // 🚀 Async email sending
public class Tool87BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(Tool87BackendApplication.class, args);
    }
}