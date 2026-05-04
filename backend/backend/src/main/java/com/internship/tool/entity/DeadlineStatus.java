package com.internship.tool.entity;

public enum DeadlineStatus {

    UPCOMING("Upcoming"),
    IN_PROGRESS("In Progress"),
    SUBMITTED("Submitted"),
    COMPLETED("Completed"),
    OVERDUE("Overdue"),
    ARCHIVED("Archived");

    private final String displayName;

    DeadlineStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}