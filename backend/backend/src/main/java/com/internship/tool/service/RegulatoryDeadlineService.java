package com.internship.tool.service;

import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.RegulatoryDeadline;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface RegulatoryDeadlineService {

    // ➕ CREATE
    RegulatoryDeadline createDeadline(RegulatoryDeadline deadline);

    // ✏️ UPDATE
    RegulatoryDeadline updateDeadline(Long id, RegulatoryDeadline deadline);

    // 🔍 GET BY ID
    RegulatoryDeadline getDeadlineById(Long id);

    // 📋 LIST
    Page<RegulatoryDeadline> getAllActiveDeadlines(Pageable pageable);

    // 🔎 FILTER
    Page<RegulatoryDeadline> getDeadlinesByStatus(DeadlineStatus status, Pageable pageable);

    // 🔍 SEARCH
    Page<RegulatoryDeadline> searchDeadlines(String keyword, Pageable pageable);

    // 📅 DATE RANGE
    Page<RegulatoryDeadline> getDeadlinesByDateRange(
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // ⏰ OVERDUE
    List<RegulatoryDeadline> getOverdueDeadlines();

    // 📊 ANALYTICS (BETTER)
    Long countActiveDeadlinesByStatus(DeadlineStatus status);


    // 🗑️ DELETE (SOFT)
    void deleteDeadline(Long id);
}