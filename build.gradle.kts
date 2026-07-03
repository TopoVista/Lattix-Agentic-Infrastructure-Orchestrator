plugins {
    java
}

allprojects {
    group = "com.lattix"
    version = "0.1.0"

    repositories {
        mavenCentral()
    }
}

subprojects {
    plugins.withId("java") {
        dependencies {
            testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.10.5")
            testImplementation("org.springframework.security:spring-security-test:6.3.4")
            // Shared test utilities for all subprojects
            testImplementation(project(":shared:test"))
            testImplementation(project(":shared:integration-test"))
        }
    }

    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
        systemProperty("spring.profiles.active", "test")
    }
}
