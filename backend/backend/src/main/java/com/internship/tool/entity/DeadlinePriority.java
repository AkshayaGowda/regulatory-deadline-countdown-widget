package com.internship.tool.entity;

public enum DeadlinePriority {

    LOW(1),
    MEDIUM(2),
    HIGH(3),
    CRITICAL(4);

    private final int level;

    DeadlinePriority(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }
}