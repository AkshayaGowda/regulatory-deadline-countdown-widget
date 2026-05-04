package com.internship.tool.exception;

import org.springframework.http.HttpStatus;

public class DuplicateDeadlineException extends RuntimeException {

    private final HttpStatus status;

    // 🔹 Default → 409 Conflict
    public DuplicateDeadlineException(String message) {
        super(message);
        this.status = HttpStatus.CONFLICT;
    }

    // 🔹 Optional custom status
    public DuplicateDeadlineException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}