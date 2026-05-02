package com.internship.tool.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<String> details // ✅ optional extra info
) {

    public static ApiErrorResponse of(int status, String error, String message, String path) {
        return new ApiErrorResponse(
                Instant.now(),
                status,
                error,
                message,
                path,
                null
        );
    }

    // ✅ For validation errors
    public static ApiErrorResponse of(int status, String error, String message, String path, List<String> details) {
        return new ApiErrorResponse(
                Instant.now(),
                status,
                error,
                message,
                path,
                details
        );
    }
}