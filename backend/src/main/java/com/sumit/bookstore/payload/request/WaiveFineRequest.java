package com.sumit.bookstore.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaiveFineRequest {

    @NotNull(message = "Fine ID is mandatory")
    private Long fineId;

    @NotBlank(message = "Waiver reason is mandatory")
    private String reason;
}
