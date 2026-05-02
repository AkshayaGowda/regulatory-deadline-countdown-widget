package com.internship.tool.dto;

import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.DeadlinePriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateDeadlineRequest {

    @NotBlank
    private String title;

    private String description;
    private String regulatoryBody;
    private String jurisdiction;
    private String category;
    private String responsibleTeam;
    private String ownerName;

    @Email
    private String ownerEmail;

    @NotNull
    private LocalDate deadlineDate;

    // ✅ FIXED (NO MORE STRING)
    @NotNull
    private DeadlineStatus status;

    @NotNull
    private DeadlinePriority priority;
}