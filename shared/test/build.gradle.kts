plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    api("org.springframework.boot:spring-boot-starter-security:3.3.5")
    implementation("org.springframework.boot:spring-boot-starter")
}

// This module provides test-time security configuration (profile=test)
