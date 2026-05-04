package com.internship.tool.repository;

import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.RegulatoryDeadline;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RegulatoryDeadlineRepository extends JpaRepository<RegulatoryDeadline, Long> {

    // 📋 LIST
    Page<RegulatoryDeadline> findAllByActiveTrue(Pageable pageable);

    Optional<RegulatoryDeadline> findByIdAndActiveTrue(Long id);

    // 🔎 FILTERS
    Page<RegulatoryDeadline> findByStatusAndActiveTrue(DeadlineStatus status, Pageable pageable);

    Page<RegulatoryDeadline> findByDeadlineDateBetweenAndActiveTrue(
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // ⏰ ALERTS / REMINDERS
    List<RegulatoryDeadline> findByDeadlineDateBeforeAndStatusInAndActiveTrue(
            LocalDate date,
            Collection<DeadlineStatus> statuses
    );

    List<RegulatoryDeadline> findByReminderDateAndStatusInAndActiveTrue(
            LocalDate date,
            Collection<DeadlineStatus> statuses
    );

    List<RegulatoryDeadline> findByDeadlineDateBetweenAndStatusInAndActiveTrue(
            LocalDate startDate,
            LocalDate endDate,
            Collection<DeadlineStatus> statuses
    );

    // 🔥 OVERDUE HELPER
    List<RegulatoryDeadline> findByDeadlineDateBeforeAndStatusNotAndActiveTrue(
            LocalDate today,
            DeadlineStatus status
    );

    // 📊 ANALYTICS
    Long countByStatusAndActiveTrue(DeadlineStatus status);
    Long countByActiveTrue();

    // 🔁 DUPLICATE CHECK (FIXED)
    boolean existsByTitleIgnoreCaseAndRegulatoryBodyIgnoreCaseAndDeadlineDateAndActiveTrue(
            String title,
            String regulatoryBody,
            LocalDate deadlineDate
    );

    boolean existsByTitleIgnoreCaseAndRegulatoryBodyIgnoreCaseAndDeadlineDateAndIdNotAndActiveTrue(
            String title,
            String regulatoryBody,
            LocalDate deadlineDate,
            Long id
    );

    // 🔍 SEARCH
    @Query("""
        SELECT rd FROM RegulatoryDeadline rd
        WHERE rd.active = true
        AND (
            LOWER(rd.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(rd.regulatoryBody) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(rd.jurisdiction) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(rd.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<RegulatoryDeadline> searchActiveByKeyword(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}