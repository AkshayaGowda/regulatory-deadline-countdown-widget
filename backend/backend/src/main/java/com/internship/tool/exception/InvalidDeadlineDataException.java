package com.internship.tool.exception;

import org.springframework.http.HttpStatus;

public class InvalidDeadlineDataException extends DeadlineOperationException {

    // 🔹 Default → 400 Bad Request
    public InvalidDeadlineDataException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    // 🔹 Optional with cause
    public InvalidDeadlineDataException(String message, Throwable cause) {
        super(message, HttpStatus.BAD_REQUEST, cause);
    }
}