package com.sumit.bookstore.service;

public interface IEmailService {

    void sendEmail(String to, String subject, String text);
}
