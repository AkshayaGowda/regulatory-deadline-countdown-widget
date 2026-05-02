package com.internship.tool.service;

import com.internship.tool.entity.DeadlineStatus;
import com.internship.tool.entity.RegulatoryDeadline;
import com.internship.tool.exception.EmailNotificationException;
import com.internship.tool.repository.RegulatoryDeadlineRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeadlineNotificationScheduler {

    private static final List<DeadlineStatus> NOTIFIABLE_STATUSES = List.of(
            DeadlineStatus.UPCOMING,
            DeadlineStatus.IN_PROGRESS
    );

    private final RegulatoryDeadlineRepository repository;
    private final DeadlineEmailService emailService;

    @Value("${app.notifications.deadline-alert-days:1}")
    private long deadlineAlertDays;

    @Scheduled(
            cron = "${app.notifications.daily-cron:0 0 9 * * *}",
            zone = "${app.notifications.time-zone:Asia/Kolkata}" // ✅ FIXED
    )
    @Transactional(readOnly = true)
    public void sendDailyDeadlineNotifications() {

        LocalDate today = LocalDate.now();

        log.info("Starting deadline notification job for {}", today);

        sendReminderNotifications(today);
        sendDeadlineAlerts(today);

        log.info("Completed deadline notification job for {}", today);
    }

    // 🔔 REMINDERS
    private void sendReminderNotifications(LocalDate today) {

        List<RegulatoryDeadline> reminders =
                repository.findByReminderDateAndStatusInAndActiveTrue(
                        today,
                        NOTIFIABLE_STATUSES
                );

        for (RegulatoryDeadline d : reminders) {
            try {
                emailService.sendReminderEmail(d);
                log.info("Reminder sent → id={}, email={}", d.getId(), d.getOwnerEmail());
            } catch (EmailNotificationException e) {
                log.error("Reminder failed → id={}, email={}", d.getId(), d.getOwnerEmail(), e);
            }
        }
    }

    // ⚠️ ALERTS
    private void sendDeadlineAlerts(LocalDate today) {

        LocalDate alertUntil = today.plusDays(Math.max(deadlineAlertDays, 0));

        List<RegulatoryDeadline> dueSoon =
                repository.findByDeadlineDateBetweenAndStatusInAndActiveTrue(
                        today,
                        alertUntil,
                        NOTIFIABLE_STATUSES
                );

        List<RegulatoryDeadline> overdue =
                repository.findByDeadlineDateBeforeAndStatusInAndActiveTrue(
                        today,
                        NOTIFIABLE_STATUSES
                );

        List<RegulatoryDeadline> alerts = mergeAlerts(overdue, dueSoon);

        for (RegulatoryDeadline d : alerts) {
            try {
                emailService.sendDeadlineAlertEmail(d);
                log.info("Alert sent → id={}, email={}", d.getId(), d.getOwnerEmail());
            } catch (EmailNotificationException e) {
                log.error("Alert failed → id={}, email={}", d.getId(), d.getOwnerEmail(), e);
            }
        }
    }

    // 🔁 MERGE WITHOUT DUPLICATES
    private List<RegulatoryDeadline> mergeAlerts(
            List<RegulatoryDeadline> overdue,
            List<RegulatoryDeadline> dueSoon
    ) {
        Map<Long, RegulatoryDeadline> map = new LinkedHashMap<>();

        overdue.forEach(d -> map.put(d.getId(), d));
        dueSoon.forEach(d -> map.put(d.getId(), d));

        return new ArrayList<>(map.values());
    }
}