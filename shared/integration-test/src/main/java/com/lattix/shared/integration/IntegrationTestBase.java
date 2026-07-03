package com.lattix.shared.integration;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.junit.jupiter.api.BeforeAll;

@Testcontainers
public abstract class IntegrationTestBase {

    @Container
    public static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @BeforeAll
    public static void beforeAll() {
        System.setProperty("SPRING_DATASOURCE_URL", POSTGRES.getJdbcUrl());
        System.setProperty("SPRING_DATASOURCE_USERNAME", POSTGRES.getUsername());
        System.setProperty("SPRING_DATASOURCE_PASSWORD", POSTGRES.getPassword());
    }
}
