package com.internship.tool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"aiDescription", "aiRecommendations"})
@Entity
@Table(
        name = "regulatory_deadlines",
        indexes = {
                @Index(name = "idx_deadline_date", columnList = "deadline_date"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_priority", columnList = "priority"),
                @Index(name = "idx_active", columnList = "active")
        }
)
@EntityListeners(AuditingEntityListener.class)
public class RegulatoryDeadline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC INFO =================

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank
    @Size(max = 120)
    @Column(name = "regulatory_body", nullable = false, length = 120)
    private String regulatoryBody;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String jurisdiction;

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String category;

    @NotBlank
    @Size(max = 2000)
    @Column(nullable = false, length = 2000)
    private String description;

    // ================= DATES =================

    @NotNull
    @Column(name = "deadline_date", nullable = false)
    private LocalDate deadlineDate;

    @Column(name = "reminder_date")
    private LocalDate reminderDate;

    // ================= STATUS =================

    @Builder.Default
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeadlineStatus status = DeadlineStatus.UPCOMING;

    @Builder.Default
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeadlinePriority priority = DeadlinePriority.MEDIUM;

    // ================= OWNER =================

    @NotBlank
    @Size(max = 100)
    @Column(name = "responsible_team", nullable = false, length = 100)
    private String responsibleTeam;

    @NotBlank
    @Size(max = 100)
    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @NotBlank
    @Email
    @Size(max = 150)
    @Column(name = "owner_email", nullable = false, length = 150)
    private String ownerEmail;

    // ================= OPTIONAL =================

    @Size(max = 500)
    @Column(name = "reference_url", length = 500)
    private String referenceUrl;

    @Size(max = 4000)
    @Column(name = "ai_description", length = 4000)
    private String aiDescription;

    @Size(max = 4000)
    @Column(name = "ai_recommendations", length = 4000)
    private String aiRecommendations;

    @Min(0)
    @Max(100)
    @Column(name = "risk_score")
    private Integer riskScore;

    // ================= ACTIVE =================

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    // ================= AUDIT =================

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ================= VALIDATION =================

    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (reminderDate != null && deadlineDate != null && reminderDate.isAfter(deadlineDate)) {
            throw new IllegalArgumentException("Reminder date cannot be after deadline date");
        }
    }
}