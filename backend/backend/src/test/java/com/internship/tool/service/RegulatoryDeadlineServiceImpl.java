package com.internship.tool.service;

import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.RegulatoryDeadline;
import com.internship.tool.exception.DeadlineOperationException;
import com.internship.tool.exception.DuplicateDeadlineException;
import com.internship.tool.exception.InvalidDeadlineDataException;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.RegulatoryDeadlineRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RegulatoryDeadlineServiceImpl implements RegulatoryDeadlineService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "deadlineDate", "title", "regulatoryBody", "priority", "status", "createdAt"
    );

    private static final List<DeadlineStatus> OVERDUE_TRACKABLE_STATUSES = List.of(
            DeadlineStatus.UPCOMING,
            DeadlineStatus.IN_PROGRESS
    );

    private final RegulatoryDeadlineRepository repository;
    private final Validator validator;

    // ================= CREATE =================
    @Override
    @CacheEvict(value = "deadlineById", allEntries = true)
    public RegulatoryDeadline createDeadline(RegulatoryDeadline deadline) {

        deadline = sanitize(deadline);
        validate(deadline);
        checkDuplicate(deadline, null);

        if (!deadline.isActive()) {
            throw new DeadlineOperationException("Cannot create inactive deadline");
        }

        if (deadline.getStatus() == null) {
            deadline.setStatus(DeadlineStatus.UPCOMING);
        }

        return repository.save(deadline);
    }

    // ================= UPDATE =================
    @Override
    @CacheEvict(value = "deadlineById", key = "#id")
    public RegulatoryDeadline updateDeadline(Long id, RegulatoryDeadline updated) {

        RegulatoryDeadline existing = getActiveDeadline(id);

        updated = sanitize(updated);
        validate(updated);
        checkDuplicate(updated, id);

        existing.setTitle(updated.getTitle());
        existing.setRegulatoryBody(updated.getRegulatoryBody());
        existing.setJurisdiction(updated.getJurisdiction());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setDeadlineDate(updated.getDeadlineDate());
        existing.setReminderDate(updated.getReminderDate());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setResponsibleTeam(updated.getResponsibleTeam());
        existing.setOwnerName(updated.getOwnerName());
        existing.setOwnerEmail(updated.getOwnerEmail());
        existing.setReferenceUrl(updated.getReferenceUrl());
        existing.setAiDescription(updated.getAiDescription());
        existing.setAiRecommendations(updated.getAiRecommendations());
        existing.setRiskScore(updated.getRiskScore());

        existing.setActive(updated.isActive());

        return repository.save(existing);
    }

    // ================= GET =================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "deadlineById", key = "#id")
    public RegulatoryDeadline getDeadlineById(Long id) {
        return getActiveDeadline(id);
    }

    // ================= LIST (PAGEABLE) =================
    @Override
    @Transactional(readOnly = true)
    public Page<RegulatoryDeadline> getAllActiveDeadlines(Pageable pageable) {
        return repository.findAllByActiveTrue(pageable);
    }

    // ================= LIST (TEST COMPATIBLE VERSION) =================
   
    // ================= FILTER =================
    @Override
    @Transactional(readOnly = true)
    public Page<RegulatoryDeadline> getDeadlinesByStatus(DeadlineStatus status, Pageable pageable) {

        if (status == null) {
            throw new InvalidDeadlineDataException("Status required");
        }

        return repository.findByStatusAndActiveTrue(status, pageable);
    }

    // ================= SEARCH =================
    @Override
    @Transactional(readOnly = true)
    public Page<RegulatoryDeadline> searchDeadlines(String keyword, Pageable pageable) {

        if (keyword == null || keyword.trim().isBlank()) {
            throw new InvalidDeadlineDataException("Keyword required");
        }

        return repository.searchActiveByKeyword(keyword.trim(), pageable);
    }

    // ================= DATE RANGE =================
    @Override
    @Transactional(readOnly = true)
    public Page<RegulatoryDeadline> getDeadlinesByDateRange(
            LocalDate start,
            LocalDate end,
            Pageable pageable
    ) {

        if (start == null || end == null) {
            throw new InvalidDeadlineDataException("Start & End date required");
        }

        if (end.isBefore(start)) {
            throw new InvalidDeadlineDataException("End date cannot be before start date");
        }

        return repository.findByDeadlineDateBetweenAndActiveTrue(start, end, pageable);
    }

    // ================= OVERDUE =================
    @Override
    @Transactional(readOnly = true)
    public List<RegulatoryDeadline> getOverdueDeadlines() {

        return repository.findByDeadlineDateBeforeAndStatusInAndActiveTrue(
                LocalDate.now(),
                OVERDUE_TRACKABLE_STATUSES
        );
    }

    // ================= COUNT =================
    @Override
    @Transactional(readOnly = true)
    public Long countActiveDeadlinesByStatus(DeadlineStatus status) {

        if (status == null) {
            throw new InvalidDeadlineDataException("Status required");
        }

        return repository.countByStatusAndActiveTrue(status);
    }

    // ================= DELETE =================
    @Override
    @CacheEvict(value = "deadlineById", key = "#id")
    public void deleteDeadline(Long id) {

        RegulatoryDeadline deadline = getActiveDeadline(id);

        deadline.setActive(false);
        deadline.setStatus(DeadlineStatus.ARCHIVED);

        repository.save(deadline);
    }

    // ================= PRIVATE =================

    private RegulatoryDeadline getActiveDeadline(Long id) {

        if (id == null || id <= 0) {
            throw new InvalidDeadlineDataException("Invalid ID");
        }

        return repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deadline not found"));
    }

    private void checkDuplicate(RegulatoryDeadline d, Long id) {

        boolean exists = (id == null)
                ? repository.existsByTitleIgnoreCaseAndRegulatoryBodyIgnoreCaseAndDeadlineDateAndActiveTrue(
                d.getTitle(), d.getRegulatoryBody(), d.getDeadlineDate()
        )
                : repository.existsByTitleIgnoreCaseAndRegulatoryBodyIgnoreCaseAndDeadlineDateAndIdNotAndActiveTrue(
                d.getTitle(), d.getRegulatoryBody(), d.getDeadlineDate(), id
        );

        if (exists) {
            throw new DuplicateDeadlineException("Duplicate deadline exists");
        }
    }

    private void validate(RegulatoryDeadline d) {

        Set<ConstraintViolation<RegulatoryDeadline>> violations = validator.validate(d);

        if (!violations.isEmpty()) {
            String msg = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new InvalidDeadlineDataException(msg);
        }

        if (d.getReminderDate() != null &&
                d.getDeadlineDate() != null &&
                d.getReminderDate().isAfter(d.getDeadlineDate())) {
            throw new InvalidDeadlineDataException("Reminder cannot be after deadline");
        }
    }

    private RegulatoryDeadline sanitize(RegulatoryDeadline d) {

        d.setTitle(trim(d.getTitle()));
        d.setRegulatoryBody(trim(d.getRegulatoryBody()));
        d.setJurisdiction(trim(d.getJurisdiction()));
        d.setCategory(trim(d.getCategory()));
        d.setDescription(trim(d.getDescription()));
        d.setResponsibleTeam(trim(d.getResponsibleTeam()));
        d.setOwnerName(trim(d.getOwnerName()));
        d.setOwnerEmail(lower(trim(d.getOwnerEmail())));
        d.setReferenceUrl(trim(d.getReferenceUrl()));
        d.setAiDescription(trim(d.getAiDescription()));
        d.setAiRecommendations(trim(d.getAiRecommendations()));

        return d;
    }

    private String trim(String v) {
        return v == null ? null : v.trim();
    }

    private String lower(String v) {
        return v == null ? null : v.toLowerCase();
    }
}