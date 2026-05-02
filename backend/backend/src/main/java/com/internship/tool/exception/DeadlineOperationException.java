package com.internship.tool.exception;

import org.springframework.http.HttpStatus;

public class DeadlineOperationException extends RuntimeException {

    private final HttpStatus status;

    // 🔹 Default → 400 Bad Request
    public DeadlineOperationException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    // 🔹 Custom status
    public DeadlineOperationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    // 🔹 With cause (default 500)
    public DeadlineOperationException(String message, Throwable cause) {
        super(message, cause);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // 🔹 Full constructor
    public DeadlineOperationException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}