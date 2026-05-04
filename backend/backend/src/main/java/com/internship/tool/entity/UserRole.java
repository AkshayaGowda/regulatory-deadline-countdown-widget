package com.internship.tool.entity;

public enum UserRole {

    ADMIN("Admin"),
    MANAGER("Manager"),
    USER("User");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    // ✅ Helper for Spring Security
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}