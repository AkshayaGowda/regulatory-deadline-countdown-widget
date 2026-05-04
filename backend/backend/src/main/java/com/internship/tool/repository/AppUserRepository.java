package com.internship.tool.repository;

import com.internship.tool.entity.AppUser;
import com.internship.tool.entity.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    // ================= AUTH =================

    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByEmailIgnoreCaseAndEnabledTrue(String email);

    boolean existsByEmailIgnoreCase(String email);

    // ================= ROLE =================

    List<AppUser> findByRole(UserRole role);

    // ================= PASSWORD RESET =================

    // Basic lookup (your current one - keep it)
    Optional<AppUser> findByResetToken(String resetToken);

    // 🔒 Better: only valid (not expired) tokens
    Optional<AppUser> findByResetTokenAndTokenExpiryAfter(String token, Instant now);

    // 🔒 Best: also ensure user is enabled
    Optional<AppUser> findByResetTokenAndTokenExpiryAfterAndEnabledTrue(
            String token,
            Instant now
    );
}