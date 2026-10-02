package com.sumit.bookstore.domain;

public enum BookLoanStatus {

    CHECKED_OUT,

    /**
     * Book has been returned and loan is complete
     */
    RETURNED,

    /**
     * Loan is overdue (past due date and not returned)
     */
    OVERDUE,

    /**
     * Book was lost by the user
     */
    LOST,

    /**
     * Book was damaged during loan period
     */
    DAMAGED
}
