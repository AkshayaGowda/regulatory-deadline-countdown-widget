package com.internship.tool.exception;

import org.springframework.http.HttpStatus;

public class EmailNotificationException extends DeadlineOperationException {

    // 🔹 Default → 500 Internal Server Error
    public EmailNotificationException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 🔹 With cause
    public EmailNotificationException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}