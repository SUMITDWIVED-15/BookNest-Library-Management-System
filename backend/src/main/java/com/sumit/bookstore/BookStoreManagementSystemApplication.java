package com.sumit.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BookStoreManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookStoreManagementSystemApplication.class, args);
	}

}
