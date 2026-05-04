package com.internship.tool.dto;

import com.internship.tool.entity.UserRole;

public record AuthResponse(
        String token,
        String email,
        String name,
        UserRole role
) {
}