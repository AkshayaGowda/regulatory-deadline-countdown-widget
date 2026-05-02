package com.internship.tool.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends DeadlineOperationException {

    // 🔹 Default → 404 Not Found
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    // 🔹 Optional with cause
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, HttpStatus.NOT_FOUND, cause);
    }
}