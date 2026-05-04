package com.internship.tool.controller;

import com.internship.tool.dto.CreateDeadlineRequest;
import com.internship.tool.entity.DeadlinePriority;
import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.RegulatoryDeadline;
import com.internship.tool.exception.InvalidDeadlineDataException;
import com.internship.tool.service.RegulatoryDeadlineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/deadlines")
@RequiredArgsConstructor
public class RegulatoryDeadlineController {

    private final RegulatoryDeadlineService regulatoryDeadlineService;

    // ================= GET ALL =================
    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RegulatoryDeadline>> getAllDeadlines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deadlineDate") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        return ResponseEntity.ok(
                regulatoryDeadlineService.getAllActiveDeadlines(pageable)
        );
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    
    public ResponseEntity<RegulatoryDeadline> getDeadlineById(@PathVariable Long id) {
        return ResponseEntity.ok(
                regulatoryDeadlineService.getDeadlineById(id)
        );
    }

    // ================= CREATE =================
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegulatoryDeadline> create(
            @Valid @RequestBody CreateDeadlineRequest r
    ) {

        RegulatoryDeadline d = RegulatoryDeadline.builder()
                .title(r.getTitle())
                .description(r.getDescription())
                .regulatoryBody(r.getRegulatoryBody())
                .jurisdiction(r.getJurisdiction())
                .category(r.getCategory())
                .responsibleTeam(r.getResponsibleTeam())
                .ownerName(r.getOwnerName())
                .ownerEmail(r.getOwnerEmail())
                .deadlineDate(r.getDeadlineDate())
                .status(r.getStatus())
                .priority(r.getPriority())
                .build();

        return ResponseEntity.status(201)
                .body(regulatoryDeadlineService.createDeadline(d));
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegulatoryDeadline> updateDeadline(
            @PathVariable Long id,
            @Valid @RequestBody RegulatoryDeadline deadline
    ) {
        return ResponseEntity.ok(
                regulatoryDeadlineService.updateDeadline(id, deadline)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteDeadline(@PathVariable Long id) {
        regulatoryDeadlineService.deleteDeadline(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ================= SEARCH =================
   @GetMapping("/search")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Page<RegulatoryDeadline>> searchDeadlines(
        @RequestParam String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);

    return ResponseEntity.ok(
            regulatoryDeadlineService.searchDeadlines(q, pageable)
    );
}

    // ================= HELPER METHODS =================

    private DeadlineStatus parseStatus(String status) {

        if (status == null || status.isBlank()) {
            return DeadlineStatus.UPCOMING;
        }

        String normalized = status.trim().toUpperCase().replace(" ", "_");

        try {
            return DeadlineStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new InvalidDeadlineDataException(
                    "Invalid status. Allowed: UPCOMING, IN_PROGRESS, SUBMITTED, COMPLETED, OVERDUE, ARCHIVED"
            );
        }
    }

    private DeadlinePriority parsePriority(String priority) {

        if (priority == null || priority.isBlank()) {
            return DeadlinePriority.MEDIUM;
        }

        String normalized = priority.trim().toUpperCase();

        try {
            return DeadlinePriority.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new InvalidDeadlineDataException(
                    "Invalid priority. Allowed: LOW, MEDIUM, HIGH, CRITICAL"
            );
        }
    }
}