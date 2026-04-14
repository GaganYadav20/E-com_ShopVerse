package com.ecomm.exception;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiError {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String details;
}
