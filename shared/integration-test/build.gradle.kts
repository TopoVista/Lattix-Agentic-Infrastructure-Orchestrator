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
    api("org.testcontainers:junit-jupiter:1.19.1")
    api("org.testcontainers:postgresql:1.19.1")
    api("org.junit.jupiter:junit-jupiter-api:5.10.0")
}
