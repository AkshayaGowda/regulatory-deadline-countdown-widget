package com.internship.tool.service;

import com.internship.tool.entity.RegulatoryDeadline;
import com.internship.tool.exception.EmailNotificationException;
import com.internship.tool.exception.InvalidDeadlineDataException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeadlineEmailService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    private static final String TEMPLATE_REMINDER = "deadline-reminder";
    private static final String TEMPLATE_ALERT = "deadline-alert";

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.notifications.from-email:noreply@tool87.local}")
    private String fromEmail;

    // ================= REMINDER =================
    @Async
    public void sendReminderEmail(RegulatoryDeadline deadline) {
        validateRecipient(deadline);

        Context context = baseContext(deadline);
        context.setVariable("subjectLine", "Regulatory deadline reminder");
        context.setVariable("headline", "Deadline reminder");
        context.setVariable("message",
                "This is your scheduled reminder for an upcoming regulatory deadline.");

        sendHtmlEmail(
                deadline.getOwnerEmail(),
                "Reminder: " + deadline.getTitle() + " due on " + formatDate(deadline.getDeadlineDate()),
                TEMPLATE_REMINDER,
                context
        );
    }

    // ================= ALERT =================
    @Async
    public void sendDeadlineAlertEmail(RegulatoryDeadline deadline) {
        validateRecipient(deadline);

        Context context = baseContext(deadline);
        context.setVariable("subjectLine", "Regulatory deadline alert");
        context.setVariable("headline", "Deadline alert");
        context.setVariable("message", buildAlertMessage(deadline.getDeadlineDate()));

        sendHtmlEmail(
                deadline.getOwnerEmail(),
                "Alert: " + deadline.getTitle() + " deadline is near",
                TEMPLATE_ALERT,
                context
        );
    }

    // ================= PASSWORD RESET =================
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        if (toEmail == null || toEmail.isBlank()) {
            throw new InvalidDeadlineDataException("Email cannot be empty");
        }

        if (!toEmail.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new InvalidDeadlineDataException("Invalid email format");
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password");

            String body = """
                    <h2>Password Reset Request</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="%s">Reset Password</a>
                    <br><br>
                    <p>This link will expire in 15 minutes.</p>
                    """.formatted(resetLink);

            helper.setText(body, true);

            javaMailSender.send(message);

            log.info("Password reset email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send reset email to {}", toEmail, e);
            throw new EmailNotificationException("Failed to send reset email", e);
        }
    }

    // ================= COMMON METHODS =================

    private void validateRecipient(RegulatoryDeadline deadline) {

        if (deadline == null) {
            throw new InvalidDeadlineDataException("Deadline must not be null");
        }

        String email = deadline.getOwnerEmail();

        if (email == null || email.isBlank()) {
            throw new InvalidDeadlineDataException("Owner email is required");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new InvalidDeadlineDataException("Invalid email format");
        }
    }

    private Context baseContext(RegulatoryDeadline deadline) {

        Context context = new Context();

        context.setVariable("ownerName", safe(deadline.getOwnerName()));
        context.setVariable("title", safe(deadline.getTitle()));
        context.setVariable("regulatoryBody", safe(deadline.getRegulatoryBody()));
        context.setVariable("deadlineDate", formatDate(deadline.getDeadlineDate()));
        context.setVariable("reminderDate", formatDate(deadline.getReminderDate()));
        context.setVariable("status", deadline.getStatus() != null ? deadline.getStatus().name() : "N/A");
        context.setVariable("priority", deadline.getPriority() != null ? deadline.getPriority().name() : "N/A");
        context.setVariable("responsibleTeam", safe(deadline.getResponsibleTeam()));
        context.setVariable("description", safe(deadline.getDescription()));
        context.setVariable("referenceUrl", safe(deadline.getReferenceUrl()));

        return context;
    }

    private void sendHtmlEmail(String recipient, String subject, String templateName, Context context) {

        try {
            String htmlBody = templateEngine.process(templateName, context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            javaMailSender.send(message);

            log.info("Email sent successfully to {}", recipient);

        } catch (MessagingException e) {
            throw new EmailNotificationException("Failed to prepare email", e);
        } catch (Exception e) {
            throw new EmailNotificationException("Failed to send email", e);
        }
    }

    private String buildAlertMessage(LocalDate deadlineDate) {
        if (deadlineDate == null) return "A regulatory deadline needs your attention.";

        LocalDate today = LocalDate.now();

        if (deadlineDate.isBefore(today)) {
            return "This deadline is overdue. Immediate action required.";
        }

        if (deadlineDate.isEqual(today)) {
            return "This deadline is due today. Please act immediately.";
        }

        return "This deadline is approaching soon. Please review and take action.";
    }

    private String formatDate(LocalDate date) {
        return date == null ? "Not set" : DATE_FORMATTER.format(date);
    }

    private String safe(String value) {
        return value == null ? "N/A" : value;
    }
}